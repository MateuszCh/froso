import { IFieldData } from './field';
import { IModelData, Model } from './model';

export interface IPostTypeData extends IModelData {
    title: string;
    pluralTitle: string;
    type: string;
    fields: IFieldData[];
    isComponent: boolean;
}

export class PostType extends Model {
    public static readonly type = 'post type';

    constructor(protected data: IPostTypeData) {
        super(data);
    }
}
