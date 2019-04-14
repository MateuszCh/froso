import { IModelData, Model } from './model';

export interface IPostTypeData extends IModelData {}

export class PostType extends Model {
    public static readonly type = 'post_type';

    constructor(protected data: IPostTypeData) {
        super(data);
    }
}
