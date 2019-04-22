import { IModelData, Model } from './model';

export interface ICounterData extends IModelData {
    type: string;
    counter: number;
}

export class Counter extends Model {
    public static readonly type = 'counter';

    constructor(protected data: ICounterData) {
        super(data);
    }
}
