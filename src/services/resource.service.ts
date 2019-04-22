import {
    Collection,
    Db,
    DeleteWriteOpResultObject,
    FilterQuery,
    IndexSpecification,
    InsertOneWriteOpResult,
    ObjectID,
    ReplaceWriteOpResult,
} from 'mongodb';
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
        this.initIndexes();
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

    protected initIndexes = async (): Promise<void> => {
        if (this.indexes && this.indexes.length) {
            try {
                await this.collection.dropIndexes();
                await this.collection.createIndexes(this.indexes);
            } catch (e) {
                console.log(e);
            }
        }
    };

    protected getObjectId(id: string): ObjectID {
        return new ObjectID(id);
    }

    protected get collection(): Collection {
        return this.db.collection(this.collectionName);
    }
}
