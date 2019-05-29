import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Server } from 'http';
import { find, forEach } from 'lodash';
import { IndexSpecification, MongoClientOptions } from 'mongodb';
import { Logger } from 'winston';

import { defaultCollections, frosoMongo, getLogger, initMorgan } from './config';
import router from './routers';
import { errorRequestHandler } from './utils';

export interface IFrosoConfig {
    mongoURI: string;
    mongoDb: string;
    mongoOptions?: MongoClientOptions;
    mongoCollections?: IFrosoCollectionConfig[];
    port: number;
    logsDirectory?: string;
}

export interface IFrosoCollectionConfig {
    collectionName: string;
    indexes?: IndexSpecification[];
}

export class Froso {
    public logger!: Logger;
    protected express: express.Application = express();

    protected customRouters: express.Router[] = [];

    constructor(protected config: IFrosoConfig) {}

    public addRouter(customRouter: express.Router): void {
        this.customRouters.push(customRouter);
    }

    protected get mongoCollections(): IFrosoCollectionConfig[] {
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

    public async init(): Promise<Server> {
        return new Promise(resolve => {
            frosoMongo
                .connectMongo(this.config.mongoURI, this.config.mongoDb, this.config.mongoOptions)
                .then(() => {
                    forEach(this.mongoCollections, frosoMongo.initCollection);

                    this.logger = getLogger(this.config.logsDirectory);
                    initMorgan(this.express, this.logger);
                    this.express.use(bodyParser.json({ limit: '1mb' }));
                    this.express.use(bodyParser.urlencoded({ extended: false, limit: '1mb' }));

                    forEach(this.customRouters, (customRouter: express.Router) => this.express.use(customRouter));

                    this.express.use('/api', router);
                    this.express.get(['*'], (req: express.Request, res: express.Response) =>
                        res.send('<h1 style="color: steelblue">Froso</h1>')
                    );

                    errorRequestHandler(this.express);
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

    protected listen(): Server {
        return this.express.listen(this.config.port);
    }
}
