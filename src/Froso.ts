import * as bodyParser from 'body-parser';
import * as connectMongo from 'connect-mongo';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as expressSession from 'express-session';
import { Server } from 'http';
import { find, forEach } from 'lodash';

import { Logger } from 'winston';

import {
    defaultCollections,
    frosoMongo,
    FrosoMulter,
    frosoPassport,
    getWinston,
    IFrosoCollectionConfig,
    IFrosoMongoConfig,
    IFrosoMulterConfig,
    IFrosoPassportConfig,
    initMorgan
} from './config';
import { UsersController } from './controllers';
import router from './routers';
import { FilesRouter } from './routers/files.router';
import { errorHandler } from './utils';

export interface IFrosoConfig {
    mongoConfig: IFrosoMongoConfig;
    passportConfig: IFrosoPassportConfig;
    port: number;
    logsDirectory?: string;
    multerConfig?: IFrosoMulterConfig;
}

export class Froso {
    public logger: Logger;
    public express: express.Application = express();
    public multer?: FrosoMulter;

    protected customRouters: express.Router[] = [];

    constructor(protected config: IFrosoConfig) {
        this.logger = getWinston(this.config.logsDirectory);
        initMorgan(this.express, this.logger);

        const multerConfig = config.multerConfig;

        if (multerConfig) {
            if (multerConfig.customMulter) {
                this.multer = multerConfig.customMulter;
            } else if (multerConfig.directory) {
                this.multer = new FrosoMulter(multerConfig.directory, multerConfig.fileTypes, multerConfig.limits);
            }
        }

        this.express.use(bodyParser.json({ limit: '1mb' }));
        this.express.use(bodyParser.urlencoded({ extended: false, limit: '1mb' }));
        this.express.use(cookieParser());
    }

    public addRouter(customRouter: express.Router): void {
        this.customRouters.push(customRouter);
    }

    public async init(): Promise<Server> {
        const { uri, dbName, options } = this.config.mongoConfig;

        try {
            const db = await frosoMongo.connectMongo(uri, dbName, options);

            // tslint:disable-next-line: variable-name
            const MongoStore = connectMongo(expressSession);

            this.express.use(
                expressSession({
                    cookie: { maxAge: 3600000 },
                    name: this.config.passportConfig.sessionName,
                    resave: true,
                    saveUninitialized: true,
                    secret: this.config.passportConfig.sessionSecret,
                    store: new MongoStore({ db })
                })
            );

            frosoPassport.init(this.express);

            const usersController = new UsersController();

            try {
                await usersController.createUsers(this.config.passportConfig.users);
            } catch (e) {
                console.log(e);
            }

            forEach(this.mongoCollections(), frosoMongo.initCollection);
            forEach(this.customRouters, (customRouter: express.Router) => this.express.use(customRouter));
            this.express.use('/api', router);

            if (this.multer) {
                const filesRouter = new FilesRouter(this.multer);

                this.express.use('/api/file', filesRouter.getRouter());
                this.express.use('/uploads', express.static(this.multer.directory));
            }

            this.express.get(['*'], (req: express.Request, res: express.Response) =>
                res.send('<h1 style="color: steelblue">Froso</h1>')
            );
            this.express.use(['*'], (req: express.Request, res: express.Response) =>
                res.status(404).send(`${req.method}: ${req.params[0]} not found`)
            );

            this.express.use(errorHandler());

            return this.listen();
        } catch (err) {
            this.express.get(['*'], (req: express.Request, res: express.Response) => {
                res.status(500).send('<h1>Database error</h1>');
            });

            return this.listen();
        }
    }

    protected mongoCollections(): IFrosoCollectionConfig[] {
        const configCollections: IFrosoCollectionConfig[] = this.config.mongoConfig.collections || [];

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
