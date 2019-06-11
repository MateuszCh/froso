import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Server } from 'http';
import { find, forEach } from 'lodash';
import { MongoClientOptions } from 'mongodb';
import { Logger } from 'winston';

import { defaultCollections, frosoMongo, getWinston, IFrosoCollectionConfig, initMorgan } from './config';
import router from './routers';
import { errorHandler } from './utils';

export interface IFrosoConfig {
    mongoURI: string;
    mongoDb: string;
    mongoOptions?: MongoClientOptions;
    mongoCollections?: IFrosoCollectionConfig[];
    port: number;
    logsDirectory?: string;
}

export class Froso {
    public logger: Logger;
    protected express: express.Application = express();

    protected customRouters: express.Router[] = [];

    constructor(protected config: IFrosoConfig) {
        this.logger = getWinston(this.config.logsDirectory);
        initMorgan(this.express, this.logger);

        this.express.use(bodyParser.json({ limit: '1mb' }));
        this.express.use(bodyParser.urlencoded({ extended: false, limit: '1mb' }));
    }

    public addRouter(customRouter: express.Router): void {
        this.customRouters.push(customRouter);
    }

    public async init(): Promise<Server> {
        return new Promise(resolve => {
            frosoMongo
                .connectMongo(this.config.mongoURI, this.config.mongoDb, this.config.mongoOptions)
                .then(() => {
                    forEach(this.mongoCollections(), frosoMongo.initCollection);
                    forEach(this.customRouters, (customRouter: express.Router) => this.express.use(customRouter));
                    this.express.use('/api', router);
                    this.express.get(['*'], (req: express.Request, res: express.Response) =>
                        res.send('<h1 style="color: steelblue">Froso</h1>')
                    );
                    this.express.use(['*'], (req: express.Request, res: express.Response) =>
                        res.status(404).send(`${req.method}: ${req.params[0]} not found`)
                    );

                    this.express.use(errorHandler());

                    resolve(this.listen());
                })
                .catch(() => {
                    this.express.get(['*'], (req: express.Request, res: express.Response) => {
                        res.status(500).send('<h1>Database error</h1>');
                    });
                    resolve(this.listen());
                });
        });
    }

    protected mongoCollections(): IFrosoCollectionConfig[] {
        const configCollections: IFrosoCollectionConfig[] = this.config.mongoCollections || [];

        const validDefaultCollections = defaultCollections.filter(
            defaultCollection =>
                !find(
                    configCollections,
                    configCollection => configCollection.collectionName === defaultCollection.collectionName
                )
        );

        return configCollections.concat(validDefaultCollections);
    }

    protected listen(): Server {
        return this.express.listen(this.config.port);
    }
}
