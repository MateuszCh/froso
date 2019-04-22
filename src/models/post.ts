import { IModelData, Model } from './model';

export interface IPostData extends IModelData {
    title: string;
    type: string;
    data: {
        [key: string]: any;
    };
}

export class Post extends Model {
    public static readonly type = 'post';

    constructor(protected data: IPostData) {
        super(data);
    }
}
