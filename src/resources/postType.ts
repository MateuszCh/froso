import { InsertOneWriteOpResult } from 'mongodb';

import { fieldsValidatorFactory, formatFields, formatId } from '../utils';
import { IResourceData, IResourceRequestData, Resource } from './resource';

export interface IFieldData {
    title: string;
    type: string;
    id: string;
    selectOptions?: string;
    options?: string[];
    multiselectOptions?: string;
    multiOptions?: string[];
    repeaterFields?: IFieldData[];
}

export interface IPostTypeData extends IResourceData {
    title: string;
    pluralTitle: string;
    type: string;
    fields: IFieldData[];
    posts: number[];
}

export interface IPostTypeRequestData extends IResourceRequestData {
    title?: string;
    pluralTitle?: string;
    type?: string;
    fields?: IFieldData[];
    posts?: number[];
}

export const requiredFieldDataFields = ['title', 'type', 'id'];
export const allowedFieldDataFields = [
    ...requiredFieldDataFields,
    'selectOptions',
    'multiselectOptions',
    'repeaterFields'
];
export const stringFieldDataFields = [...requiredFieldDataFields, 'selectOptions', 'multiselectOptions'];

export class PostType extends Resource<IPostTypeData, IPostTypeRequestData> {
    public readonly resourceType = 'post_type';
    public readonly collectionName = 'post_types';

    public defaults = {
        fields: []
    };

    public customValidators = [
        fieldsValidatorFactory('id'),
        fieldsValidatorFactory('required'),
        fieldsValidatorFactory('string')
    ];

    public stringFields = ['title', 'pluralTitle', 'type'];

    public requiredFields = ['title', 'pluralTitle', 'type'];
    public notRequiredFields = ['fields'];
    public uniqueFields = ['type'];

    public formatBeforeSave(data: IPostTypeRequestData): IPostTypeRequestData {
        const postType = { ...data };
        if (postType.type) {
            postType.type = formatId(postType.type);
        }
        if (postType.fields) {
            postType.fields = formatFields(postType.fields);
        }
        return postType;
    }

    public create(data: IPostTypeRequestData): Promise<InsertOneWriteOpResult> {
        data.posts = [];
        return super.create(data);
    }
}
