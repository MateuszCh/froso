import { forEach } from 'lodash';
import { Db, IndexSpecification, MongoClient, MongoClientOptions } from 'mongodb';

export interface IFrosoCollectionConfig {
    collectionName: string;
    indexes?: IndexSpecification[];
}

export type OnConnectMongo = (db: Db) => void;

export class Mongo {
    public db!: Db;

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
            const collection = await this.db.createCollection(collectionConfig.collectionName);
            await collection.dropIndexes();
            if (collectionConfig.indexes) {
                collection.createIndexes(collectionConfig.indexes);
            }
        } catch (e) {
            console.log(e);
        }
    };
}

export const frosoMongo = new Mongo();
