import { IModelData, Model } from './model';

export interface IPostData extends IModelData {}

export class Post extends Model {
    public static readonly type = 'post';

    constructor(protected data: IPostData) {
        super(data);
    }
}
