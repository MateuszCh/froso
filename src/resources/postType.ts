import { fieldsIdsValidator, fieldsRequiredValidator, formatFields } from '../utils';
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

export const requiredFieldDataFields = ['title', 'type', 'id'];
export const allowedFieldDataFields = [
    ...requiredFieldDataFields,
    'selectOptions',
    'multiselectOptions',
    'repeaterFields'
];

export class PostType extends Resource<IPostTypeData, IPostTypeRequestData> {
    public readonly resourceType = 'post_type';
    public readonly collectionName = 'post_types';
    public requiredFields = ['title', 'pluralTitle', 'type'];
    public allowedFields = [...this.requiredFields, 'fields', 'isComponent'];
    public uniqueFields = ['type'];
    public _createValidators = [fieldsIdsValidator, fieldsRequiredValidator];
    public _updateValidators = [fieldsIdsValidator, fieldsRequiredValidator];

    public formatResource(data: IPostTypeRequestData): IPostTypeRequestData {
        const postType = { ...data };
        if (postType.fields) {
            postType.fields = formatFields(postType.fields);
        }
        return postType;
    }
}
