import { isStringValidatorFactory, postTypeExistsValidator } from '../utils';
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
    public notRequiredFields = ['url', 'data'];
    public defaults = { data: {}, url: undefined };
    public _createValidators = [postTypeExistsValidator];
    public _updateValidators = [postTypeExistsValidator];
    public _typesValidators = [
        isStringValidatorFactory('title'),
        isStringValidatorFactory('type'),
        isStringValidatorFactory('url')
    ];
}
