import { IResourceData, IResourceRequestData, Resource } from './resource';

export interface IPostData extends IResourceData {
    title: string;
    type: string;
    url?: string;
    data: {
        [key: string]: any;
    };
}

export interface IPostRequestData extends IResourceRequestData {
    title?: string;
    type?: string;
    url?: string;
    data?: {
        [key: string]: any;
    };
}

export class Post extends Resource<IPostData, IPostRequestData> {
    public readonly resourceType = 'post';
    public readonly collectionName = 'posts';
    public requiredFields = ['title', 'type'];
    public allowedFields = [...this.requiredFields, 'url', 'data'];
}
