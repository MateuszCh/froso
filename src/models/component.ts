import { IModelData, Model } from './model';

export interface IComponentData extends IModelData {}

export class Component extends Model {
    public static readonly type = 'component';

    constructor(protected data: IComponentData) {
        super(data);
    }
}
