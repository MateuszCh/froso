import { Collection, Db, FilterQuery, ObjectID } from 'mongodb';
import { IModelData } from '../models/model';

export interface IResources<T extends IModelData> {
    [key: string]: ResourceService<T>;
}

export interface IResourceType<T extends IModelData> {
    id: string;
    resourceService?: IResourceServiceContructor<T>;
}

export type IResourceServiceContructor<T extends IModelData> = new (collectionName: string, db: Db) => ResourceService<
    T
>;

export class ResourceService<T extends IModelData> {
    constructor(protected collectionName: string, protected db: Db) {}

    public find(query: FilterQuery<T> = {}): Promise<T[]> {
        return this.collection.find(query).toArray();
    }

    public findById(id: ObjectID): Promise<T | null> {
        return this.collection.findOne({ _id: id });
    }

    protected get collection(): Collection {
        return this.db.collection(this.collectionName);
    }
}
