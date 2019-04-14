import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Server } from 'http';
import { Db, MongoClient, MongoClientOptions } from 'mongodb';

import { forEach } from 'lodash';

import { IComponentData, IFileData, IModelData, IPageData, IPostData, IPostTypeData } from './models';
import router from './routers';
import { IResources, IResourceType, ResourceService } from './services';

export interface IFrosoConfig {
    mongoURI: string;
    mongoDb: string;
    mongoOptions?: MongoClientOptions;
    port: number;
}

export class Froso {
    protected express: express.Application = express();
    protected db!: Db;
    protected config!: IFrosoConfig;
    protected resources: IResources<any> = {};
    protected resourceTypes: Array<IResourceType<any>> = [
        { id: 'pages' },
        { id: 'components' },
        { id: 'files' },
        { id: 'post_types' },
        { id: 'posts' },
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

    public get pages(): ResourceService<IPageData> {
        return this.resources.pages;
    }

    public get components(): ResourceService<IComponentData> {
        return this.resources.components;
    }

    public get files(): ResourceService<IFileData> {
        return this.resources.files;
    }

    public get postTypes(): ResourceService<IPostTypeData> {
        return this.resources.postTypes;
    }

    public async init(config: IFrosoConfig): Promise<Server | undefined> {
        this.config = config;
        this.express.use(bodyParser.json({ limit: '1mb' }));
        this.express.use(bodyParser.urlencoded({ extended: false, limit: '1mb' }));

        forEach(this.customRouters, (customRouter: express.Router) => this.express.use(customRouter));

        this.express.use('/api', router);
        this.express.get('*', (req: express.Request, res: express.Response) => res.send('<h1>Froso</h1>'));

        try {
            const client: MongoClient = await this.connectMongo();
            this.db = client.db(this.config.mongoDb);

            forEach(this.resourceTypes, (type: IResourceType<any>) => {
                this.resources[type.id] = type.resourceService
                    ? new type.resourceService(type.id, this.db)
                    : new ResourceService(type.id, this.db);
            });

            return this.listen();
        } catch (e) {
            console.log(e);
            return undefined;
        }
    }

    protected listen() {
        return this.express.listen(this.config.port);
    }

    protected connectMongo(): Promise<MongoClient> {
        return MongoClient.connect(this.config.mongoURI, this.config.mongoOptions);
    }
}

const froso = new Froso();

export default froso;
