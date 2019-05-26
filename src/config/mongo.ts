import { Db, MongoClient, MongoClientOptions } from 'mongodb';

export let db: Db;

export async function connectMongo(uri: string, dbName: string, options?: MongoClientOptions): Promise<Db> {
    const client: MongoClient = await MongoClient.connect(uri, options);
    db = client.db(dbName);
    return db;
}

export function getDb(): Db {
    return db;
}
