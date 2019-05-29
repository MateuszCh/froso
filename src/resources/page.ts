import { IResourceData, Resource } from './resource';

export interface IPageData extends IResourceData {
    title: string;
    url: string;
    data: {
        [key: string]: any;
    };
}

export class Page extends Resource<IPageData> {
    public readonly type = 'page';
    public readonly collectionName = 'pages';
}
