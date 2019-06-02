import { InsertOneWriteOpResult, UpdateWriteOpResult } from 'mongodb';
import { IResourceData, IResourceRequestData, Resource } from './resource';

export interface ICounterData extends IResourceData {
    collectionName: string;
    counter: number;
}

export interface ICounterRequestData extends IResourceRequestData {
    collectionName?: string;
    counter?: number;
}

export class Counter extends Resource<ICounterData, ICounterRequestData> {
    public readonly type = 'counter';
    public readonly collectionName = 'counters';

    public findByCollectionName(collectionName: string): Promise<ICounterData | null> {
        return this.collection.findOne({ collectionName }, { projection: { _id: 0 } });
    }

    public incrementCounter(collectionName: string): Promise<UpdateWriteOpResult> {
        return this.collection.updateOne({ collectionName }, { $inc: { counter: 1 } });
    }

    public create(data: ICounterRequestData): Promise<InsertOneWriteOpResult> {
        data.counter = 1;
        return this.create(data);
    }
}
