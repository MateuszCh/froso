import { IResourceData, Resource } from './resource';

export interface ICounterData extends IResourceData {
    type: string;
    counter: number;
}

export class Counter extends Resource<ICounterData> {
    public readonly type = 'counter';
    public readonly collectionName = 'counters';
    public readonly validators = [];
}
