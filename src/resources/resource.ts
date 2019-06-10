import { ValidationChain } from 'express-validator/check';
import { Collection, Db, FilterQuery, FindAndModifyWriteOpResultObject, InsertOneWriteOpResult } from 'mongodb';

import { frosoMongo } from '../config';
import { notFalsyValidator, requiredValidator } from '../utils';

export interface IResourceData {
    created?: number;
    id?: number;
    type?: string;
}

export interface IResourceRequestData {
    id?: number;
    [key: string]: any;
}

export abstract class Resource<T extends IResourceData, D extends IResourceRequestData> {
    public abstract readonly type: string;

    public abstract readonly collectionName: string;

    public requiredFields: string[] = [];

    public _createValidators: ValidationChain[] = [];
    public _updateValidators: ValidationChain[] = [];

    public get createValidators(): ValidationChain[] {
        return [...this._createValidators, requiredValidator(this.requiredFields)];
    }

    public get updateValidators(): ValidationChain[] {
        return [...this._updateValidators, notFalsyValidator(this.requiredFields)];
    }

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

    public deleteById(id: number): Promise<FindAndModifyWriteOpResultObject<T>> {
        return this.collection.findOneAndDelete({ id }, { projection: { _id: 0 } });
    }

    public updateById(id: number, data: D): Promise<FindAndModifyWriteOpResultObject<T>> {
        return this.collection.findOneAndUpdate(
            { id },
            { $set: data },
            { projection: { _id: 0 }, returnOriginal: false }
        );
    }

    public create(requestData: D): Promise<InsertOneWriteOpResult> {
        const data: IResourceData = { ...requestData, created: Date.now(), type: this.type };
        return this.collection.insertOne(data);
    }
}
