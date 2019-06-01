import { ValidationChainBuilder } from 'express-validator/check';
import {
    Collection,
    Db,
    DeleteWriteOpResultObject,
    FilterQuery,
    InsertOneWriteOpResult,
    ObjectID,
    ReplaceWriteOpResult
} from 'mongodb';

import { frosoMongo } from '../config';

export interface IResourceData {
    _id?: ObjectID;
    created?: number;
    id?: number;
    type?: string;
}

export abstract class Resource<T extends IResourceData> {
    public abstract readonly type: string;

    public abstract readonly collectionName: string;

    public readonly validators: ValidationChainBuilder[] = [];

    public get collection(): Collection {
        return this.db.collection(this.collectionName);
    }

    public get db(): Db {
        return frosoMongo.db;
    }

    public find(query: FilterQuery<T> = {}): Promise<T[]> {
        return this.collection
            .find(query)
            .project({ _id: 0 })
            .toArray();
    }

    public findById(id: number): Promise<T | null> {
        return this.collection.findOne({ id }, { projection: { _id: 0 } });
    }

    public deleteById(id: number): Promise<DeleteWriteOpResultObject> {
        return this.collection.deleteOne({ id });
    }

    public updateById(id: number, data: T): Promise<ReplaceWriteOpResult> {
        return this.collection.replaceOne({ id }, data);
    }

    public create(data: T): Promise<InsertOneWriteOpResult> {
        data.created = Date.now();
        data.type = this.type;
        return this.collection.insertOne(data);
    }

    protected getObjectId(id: string): ObjectID {
        return new ObjectID(id);
    }
}
