import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Server } from 'http';
import { forEach } from 'lodash';
import { MongoClientOptions } from 'mongodb';
import { Logger } from 'winston';

import { connectMongo, getLogger, initMorgan } from './config';
import router from './routers';
import { errorRequestHandler } from './utils';

export interface IFrosoConfig {
    mongoURI: string;
    mongoDb: string;
    mongoOptions?: MongoClientOptions;
    port: number;
    logsDirectory?: string;
}

export class Froso {
    public logger!: Logger;
    protected express: express.Application = express();

    protected customRouters: express.Router[] = [];

    constructor(protected config: IFrosoConfig) {}

    public addRouter(customRouter: express.Router): void {
        this.customRouters.push(customRouter);
    }

    public async init(): Promise<Server | undefined> {
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

        try {
            await connectMongo(this.config.mongoURI, this.config.mongoDb, this.config.mongoOptions);

            return this.listen();
        } catch (e) {
            console.log(e);
            return undefined;
        }
    }

    protected listen(): Server {
        return this.express.listen(this.config.port);
    }
}
