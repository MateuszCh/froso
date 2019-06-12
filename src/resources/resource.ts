import { ValidationChain } from 'express-validator/check';
import { Collection, Db, FilterQuery, FindAndModifyWriteOpResultObject, InsertOneWriteOpResult } from 'mongodb';

import { frosoMongo } from '../config';
import { notFalsyValidatorFactory, requiredValidatorFactory, uniqueValidatorFactory } from '../utils';

export interface IResourceData {
    created: number;
    id: number;
    resourceType: string;
}

export interface IResourceRequestData {
    id?: number;
    resourceType?: string;
}

export abstract class Resource<T extends IResourceData, D extends IResourceRequestData> {
    public abstract readonly resourceType: string;

    public abstract readonly collectionName: string;

    public requiredFields: string[] = [];
    public allowedFields: string[] = [];
    public uniqueFields: string[] = [];

    public _createValidators: ValidationChain[] = [];
    public _updateValidators: ValidationChain[] = [];

    public formatResource(data: D): D {
        return data;
    }

    public get createValidators(): ValidationChain[] {
        return [
            ...this._createValidators,
            requiredValidatorFactory<D>(this.requiredFields),
            uniqueValidatorFactory(this.uniqueFields, this)
        ];
    }

    public get updateValidators(): ValidationChain[] {
        return [
            ...this._updateValidators,
            notFalsyValidatorFactory<D>(this.requiredFields),
            uniqueValidatorFactory(this.uniqueFields, this)
        ];
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

    public findOne(query: FilterQuery<T> = {}): Promise<T | null> {
        return this.collection.findOne(query, { projection: { _id: 0 } });
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
        const data: D = { ...requestData, created: Date.now(), resourceType: this.resourceType };
        return this.collection.insertOne(data);
    }
}
