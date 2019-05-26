import { IFieldData } from './field';
import { IResourceData, Resource } from './resource';

export interface IPostTypeData extends IResourceData {
    title: string;
    pluralTitle: string;
    type: string;
    fields: IFieldData[];
    isComponent: boolean;
}

export class PostType extends Resource<IPostTypeData> {
    public readonly type = 'post_type';
    public readonly collectionName = 'post_types';
    public readonly validators = [];
}
