import { IResourceData, IResourceRequestData, Resource } from './resource';

export interface IPostData extends IResourceData {
    title: string;
    postType: string;
    data: {
        [key: string]: any;
    };
}

export interface IPostRequestData extends IResourceRequestData {
    title?: string;
    postType?: string;
    data?: {
        [key: string]: any;
    };
}

export class Post extends Resource<IPostData, IPostRequestData> {
    public readonly type = 'post';
    public readonly collectionName = 'posts';
    public requiredFields = ['title', 'postType'];
}
