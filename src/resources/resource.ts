import { ValidationChain } from 'express-validator/check';
import { defaults, map, mapValues } from 'lodash';
import {
    Collection,
    Db,
    DeleteWriteOpResultObject,
    FilterQuery,
    FindAndModifyWriteOpResultObject,
    InsertOneWriteOpResult,
    InsertWriteOpResult,
    UpdateQuery,
    UpdateWriteOpResult
} from 'mongodb';

import { frosoMongo } from '../config';
import { filterEmpty, requiredValidatorFactory, uniqueValidatorFactory } from '../utils';

export interface IResourceData {
    created: number;
    id: number;
    resourceType: string;
    _id: string;
}

export interface IResourceRequestData {
    id?: number;
    resourceType?: string;
}

export abstract class Resource<T extends IResourceData, D extends IResourceRequestData> {
    public abstract readonly resourceType: string;
    public abstract readonly collectionName: string;

    public _createValidators: ValidationChain[] = [];
    public _updateValidators: ValidationChain[] = [];
    public _typesValidators: ValidationChain[] = [];

    public requiredFields: string[] = [];
    public notRequiredFields: string[] = [];
    public uniqueFields: string[] = [];

    public abstract defaults: D;

    public get allowedFields(): string[] {
        return [...this.requiredFields, ...this.notRequiredFields];
    }

    public get createValidators(): ValidationChain[] {
        return [
            requiredValidatorFactory<D>(this.requiredFields),
            uniqueValidatorFactory(this.uniqueFields, this),
            ...this._typesValidators,
            ...this._createValidators
        ];
    }

    public get updateValidators(): ValidationChain[] {
        return [
            requiredValidatorFactory<D>(this.requiredFields),
            uniqueValidatorFactory(this.uniqueFields, this),
            ...this._typesValidators,
            ...this._updateValidators
        ];
    }

    public formatBeforeSave(data: D): D {
        return data;
    }

    public get collection(): Collection {
        return this.db.collection(this.collectionName);
    }

    public get db(): Db {
        return frosoMongo.db;
    }

    public find(query: FilterQuery<T> = {}, projection: object = { _id: 0 }): Promise<T[]> {
        return this.collection
            .find(query)
            .project(projection)
            .toArray();
    }

    public findOne(query: FilterQuery<T> = {}): Promise<T | null> {
        return this.collection.findOne(query, { projection: { _id: 0 } });
    }

    public findById(id: number): Promise<T | null> {
        return this.collection.findOne({ id }, { projection: { _id: 0 } });
    }

    public delete(query: FilterQuery<T> = {}): Promise<DeleteWriteOpResultObject> {
        return this.collection.deleteMany(query);
    }

    public deleteById(id: number): Promise<FindAndModifyWriteOpResultObject<T>> {
        return this.collection.findOneAndDelete({ id }, { projection: { _id: 0 } });
    }

    public update(query: FilterQuery<T>, update: UpdateQuery<T>): Promise<UpdateWriteOpResult> {
        return this.collection.updateMany(query, update);
    }

    public updateById(id: number, data: D): Promise<FindAndModifyWriteOpResultObject<T>> {
        data = this.getFullData(data);
        const toSet = filterEmpty(data);
        const toUnset = filterEmpty(data, true);

        const update: UpdateQuery<D> = { $set: toSet };
        if (Object.keys(toUnset).length) {
            update.$unset = mapValues(toUnset, () => '') as { [key: string]: '' };
        }

        return this.collection.findOneAndUpdate({ id }, update, { projection: { _id: 0 }, returnOriginal: false });
    }

    public create(requestData: D): Promise<InsertOneWriteOpResult> {
        const data = this.getFullData({ ...requestData, created: Date.now(), resourceType: this.resourceType });

        return this.collection.insertOne(filterEmpty(data));
    }

    public createMany(requestDataArray: D[]): Promise<InsertWriteOpResult> {
        const dataArray = map(requestDataArray, (requestData: D) => {
            const data = filterEmpty(this.getFullData({ ...requestData }));
            data.created = data.created || Date.now();
            return data;
        });

        return this.collection.insertMany(dataArray);
    }

    public getFullData(data: D): D {
        return defaults(data, this.defaults);
    }
}
