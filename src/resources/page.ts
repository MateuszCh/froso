import { IResourceData, IResourceRequestData, Resource } from './resource';

export interface IPageData extends IResourceData {
    title: string;
    url: string;
    data: {
        [key: string]: any;
    };
}

export interface IPageRequestData extends IResourceRequestData {
    title?: string;
    url?: string;
    data?: {
        [key: string]: any;
    };
}

export class Page extends Resource<IPageData, IPageRequestData> {
    public readonly type = 'page';
    public readonly collectionName = 'pages';
    public requiredFields = ['url', 'title'];
}
