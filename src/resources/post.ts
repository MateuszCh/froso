import { postTypeExistsValidator } from '../utils';
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
    public defaults = { data: {}, url: undefined };

    public customValidators = [postTypeExistsValidator];

    public stringFields = ['title', 'type', 'url'];

    public requiredFields = ['title', 'type'];
    public notRequiredFields = ['url', 'data'];
}
