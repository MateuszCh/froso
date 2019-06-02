import { forEach } from 'lodash';
import { Db, IndexSpecification, MongoClient, MongoClientOptions } from 'mongodb';

import { Counter } from '../resources';

export interface IFrosoCollectionConfig {
    collectionName: string;
    counter?: boolean;
    indexes?: IndexSpecification[];
}

export type OnConnectMongo = (db: Db) => void;

export class Mongo {
    public db!: Db;

    public counter = new Counter();

    private connectListeners: OnConnectMongo[] = [];

    public async connectMongo(uri: string, dbName: string, options?: MongoClientOptions): Promise<Db> {
        if (this.db) {
            return this.db;
        }
        const client: MongoClient = await MongoClient.connect(uri, options);
        this.db = client.db(dbName);
        forEach(this.connectListeners, (listener: OnConnectMongo) => listener(this.db));
        return this.db;
    }

    public onConnect(listener: OnConnectMongo) {
        if (this.db) {
            listener(this.db);
        } else {
            this.connectListeners.push(listener);
        }
    }

    public initCollection = async (collectionConfig: IFrosoCollectionConfig) => {
        try {
            const collectionName = collectionConfig.collectionName;
            const collection = await this.db.createCollection(collectionName);
            await collection.dropIndexes();
            if (collectionConfig.counter) {
                const counter = await this.counter.findByCollectionName(collectionName);
                if (!counter) {
                    await this.counter.create({ collectionName });
                }
            }

            if (collectionConfig.indexes) {
                collection.createIndexes(collectionConfig.indexes);
            }
        } catch (e) {
            console.log(e);
        }
    };
}

export const frosoMongo = new Mongo();
