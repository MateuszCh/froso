import { ObjectID } from 'mongodb';
export interface IModelData {
    _id?: ObjectID;
    created?: number;
    id: number;
}

export interface IModelConstructor<T extends Model, D extends IModelData> {
    type: string;
    new (data: D): T;
}

export abstract class Model {
    public static readonly type: string;

    constructor(protected data: IModelData) {}
}
