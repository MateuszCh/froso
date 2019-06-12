import { IResourceData, IResourceRequestData, Resource } from './resource';

export interface IFieldData {
    title: string;
    type: string;
    id: string;
    selectOptions?: string;
    multiselectOptions?: string;
    repeaterFields?: IFieldData[];
}

export interface IPostTypeData extends IResourceData {
    title: string;
    pluralTitle: string;
    type: string;
    fields: IFieldData[];
    isComponent: boolean;
}

export interface IPostTypeRequestData extends IResourceRequestData {
    title?: string;
    pluralTitle?: string;
    type?: string;
    fields?: IFieldData[];
    isComponent?: boolean;
}

export class PostType extends Resource<IPostTypeData, IPostTypeRequestData> {
    public readonly resourceType = 'post_type';
    public readonly collectionName = 'post_types';
    public requiredFields = ['title', 'pluralTitle', 'type'];
    public allowedFields = [...this.requiredFields, 'fields', 'isComponent'];
    public uniqueFields = ['type'];
}
