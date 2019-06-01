import { UpdateWriteOpResult } from 'mongodb';
import { IResourceData, Resource } from './resource';

export interface ICounterData extends IResourceData {
    collectionName: string;
    counter: number;
}

export class Counter extends Resource<ICounterData> {
    public readonly type = 'counter';
    public readonly collectionName = 'counters';

    public findByCollectionName(collectionName: string): Promise<ICounterData | null> {
        return this.collection.findOne({ collectionName }, { projection: { _id: 0 } });
    }

    public incrementCounter(collectionName: string): Promise<UpdateWriteOpResult> {
        return this.collection.updateOne({ collectionName }, { $inc: { counter: 1 } });
    }
}
