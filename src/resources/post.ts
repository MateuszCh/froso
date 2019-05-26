import { IResourceData, Resource } from './resource';

export interface IPostData extends IResourceData {
    title: string;
    type: string;
    data: {
        [key: string]: any;
    };
}

export class Post extends Resource<IPostData> {
    public readonly type = 'post';
    public readonly collectionName = 'posts';
    public readonly validators = [];
}
