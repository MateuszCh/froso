import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Server } from 'http';
import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import * as morgan from 'morgan';
import { Logger } from 'winston';

import { forEach } from 'lodash';

import { errorRequestHandler } from './errors';
import logger from './logger';
import { ICounterData, IFileData, IModelData, IPostData, IPostTypeData } from './models';
import router from './routers';
import { IResources, IResourceType, ResourceService } from './services';

export interface IFrosoConfig {
    mongoURI: string;
    mongoDb: string;
    mongoOptions?: MongoClientOptions;
    port: number;
}

export class Froso {
    public logger: Logger = logger;
    protected express: express.Application = express();
    protected db!: Db;
    protected config!: IFrosoConfig;
    protected resources: IResources<any> = {};
    protected resourceTypes: Array<IResourceType<any>> = [
        { id: 'files', indexes: [{ key: { id: 1 }, unique: true }] },
        { id: 'post_types', indexes: [{ key: { id: 1 }, unique: true }] },
        { id: 'posts', indexes: [{ key: { id: 1 }, unique: true }] },
        { id: 'counters', indexes: [{ key: { type: 1 }, unique: true }] },
    ];

    protected customRouters: express.Router[] = [];

    public addRouter(customRouter: express.Router): void {
        this.customRouters.push(customRouter);
    }

    public addResourceType<T extends IModelData>(resourceType: IResourceType<T>): void {
        this.resourceTypes.push(resourceType);
    }

    public getResource<T extends IModelData>(id: string): ResourceService<T> {
        return this.resources[id];
    }

    public get posts(): ResourceService<IPostData> {
        return this.resources.posts;
    }

    public get files(): ResourceService<IFileData> {
        return this.resources.files;
    }

    public get postTypes(): ResourceService<IPostTypeData> {
        return this.resources.postTypes;
    }

    public get counters(): ResourceService<ICounterData> {
        return this.resources.counters;
    }

    public async init(config: IFrosoConfig): Promise<Server | undefined> {
        this.config = config;
        this.express.use(bodyParser.json({ limit: '1mb' }));
        this.express.use(bodyParser.urlencoded({ extended: false, limit: '1mb' }));

        this.express.use(
            morgan('combined', {
                skip: (req: express.Request, res: express.Response) => res.statusCode >= 400,
                stream: { write: (message: string) => this.logger.info(message) },
            }),
        );

        this.express.use(
            morgan('combined', {
                skip: (req: express.Request, res: express.Response) => res.statusCode < 400,
                stream: { write: (message: string) => this.logger.error(message) },
            }),
        );

        forEach(this.customRouters, (customRouter: express.Router) => this.express.use(customRouter));

        this.express.use('/api', router);
        this.express.get(['*'], (req: express.Request, res: express.Response) =>
            res.send('<h1 style="color: steelblue">Froso</h1>'),
        );

        errorRequestHandler(this.express);

        try {
            const client: MongoClient = await this.connectMongo();
            this.db = client.db(this.config.mongoDb);

            forEach(this.resourceTypes, (type: IResourceType<any>) => {
                this.resources[type.id] = type.resourceService
                    ? new type.resourceService(type.id, this.db, type.indexes)
                    : new ResourceService(type.id, this.db, type.indexes);
            });

            return this.listen();
        } catch (e) {
            console.log(e);
            return undefined;
        }
    }

    protected listen(): Server {
        return this.express.listen(this.config.port);
    }

    protected connectMongo(): Promise<MongoClient> {
        return MongoClient.connect(this.config.mongoURI, this.config.mongoOptions);
    }
}

const froso = new Froso();

export default froso;
