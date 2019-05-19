import { ValidationChainBuilder } from 'express-validator/check';
import { ObjectID } from 'mongodb';

export interface IModelData {
    _id?: ObjectID;
    created?: number;
    id: number;
}

export interface IModelConstructor<T extends Model, D extends IModelData> {
    type: string;
    validators: ValidationChainBuilder[];
    new (data: D): T;
}

export abstract class Model {
    public static readonly type: string;

    public static readonly validators: ValidationChainBuilder[] = [];

    constructor(protected data: IModelData) {}
}
