import { Collection, Db, FilterQuery, IndexSpecification, ObjectID } from 'mongodb';
import { IModelData } from '../models/model';

export interface IResources<T extends IModelData> {
    [key: string]: ResourceService<T>;
}

export interface IResourceType<T extends IModelData> {
    id: string;
    resourceService?: IResourceServiceContructor<T>;
    indexes?: IndexSpecification[];
}

export type IResourceServiceContructor<T extends IModelData> = new (
    collectionName: string,
    db: Db,
    indexes?: IndexSpecification[],
) => ResourceService<T>;

export class ResourceService<T extends IModelData> {
    constructor(protected collectionName: string, protected db: Db, protected indexes?: IndexSpecification[]) {
        if (this.indexes && this.indexes.length) {
            this.collection.createIndexes(this.indexes);
        }
    }

    public find(query: FilterQuery<T> = {}): Promise<T[]> {
        return this.collection.find(query).toArray();
    }

    public findById(id: string): Promise<T | null> {
        const objectId = new ObjectID(id);
        return this.collection.findOne({ _id: objectId });
    }

    protected get collection(): Collection {
        return this.db.collection(this.collectionName);
    }
}
