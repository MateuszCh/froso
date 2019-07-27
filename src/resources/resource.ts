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
import { filterEmpty, requiredValidatorFactory, typeValidatorFactory, uniqueValidatorFactory } from '../utils';

export interface IResourceData {
    created: number;
    id: number;
    resourceType: string;
    _id: string;
}

export interface IResourceRequestData {
    id?: number;
    resourceType?: string;
    created?: number;
}

export abstract class Resource<T extends IResourceData, D extends IResourceRequestData> {
    public abstract readonly resourceType: string;
    public abstract readonly collectionName: string;
    public abstract defaults: D;

    public customCreateValidators: ValidationChain[] = [];
    public customUpdateValidators: ValidationChain[] = [];
    public customValidators: ValidationChain[] = [];

    public stringFields: string[] = [];
    public numberFields: string[] = [];

    public requiredFields: string[] = [];
    public notRequiredFields: string[] = [];
    public uniqueFields: string[] = [];

    public get typesValidators(): ValidationChain[] {
        return [
            typeValidatorFactory<D>(this.stringFields, 'string'),
            typeValidatorFactory<D>(this.numberFields, 'number')
        ];
    }

    public get allowedFields(): string[] {
        return [...this.requiredFields, ...this.notRequiredFields];
    }

    public get generalValidators(): ValidationChain[] {
        return [
            requiredValidatorFactory<D>(this.requiredFields),
            uniqueValidatorFactory<T, D>(this.uniqueFields, this),
            ...this.typesValidators
        ];
    }

    public get createValidators(): ValidationChain[] {
        return [...this.generalValidators, ...this.customCreateValidators, ...this.customValidators];
    }

    public get updateValidators(): ValidationChain[] {
        return [...this.generalValidators, ...this.customUpdateValidators, ...this.customValidators];
    }

    public formatBeforeSave(data: D): D {
        return data;
    }

    public formatManyBeforeSave(data: D[]): D[] {
        return map(data, modelData => this.formatBeforeSave(modelData));
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
