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
    id: number;
    type: string;
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
        return this.collection.find(query).toArray();
    }

    public findById(id: string): Promise<T | null> {
        const _id = this.getObjectId(id);
        return this.collection.findOne({ _id });
    }

    public deleteById(id: string): Promise<DeleteWriteOpResultObject> {
        const _id = this.getObjectId(id);
        return this.collection.deleteOne({ _id });
    }

    public updateById(id: string, data: T): Promise<ReplaceWriteOpResult> {
        const _id = this.getObjectId(id);
        return this.collection.replaceOne({ _id }, data);
    }

    public create(data: T): Promise<InsertOneWriteOpResult> {
        return this.collection.insertOne(data);
    }

    protected getObjectId(id: string): ObjectID {
        return new ObjectID(id);
    }
}
