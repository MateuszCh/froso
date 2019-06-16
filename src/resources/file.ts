import { body } from 'express-validator/check';

import { isStringValidatorFactory } from '../utils';
import { IResourceData, IResourceRequestData, Resource } from './resource';

export interface IFileData extends IResourceData {
    title?: string;
    filename: string;
    src: string;
    description?: string;
    author?: string;
    place?: string;
    type: string;
    size: string;
    catalogues?: string[];
    position?: number;
}

export interface IFileRequestData extends IResourceRequestData {
    title?: string;
    filename?: string;
    src?: string;
    description?: string;
    author?: string;
    place?: string;
    type?: string;
    size?: string;
    catalogues?: string[];
    position?: number;
}

export class FrosoFile extends Resource<IFileData, IFileRequestData> {
    public readonly resourceType = 'file';
    public readonly collectionName = 'files';
    public requiredFields = ['filename'];
    public notRequiredFields = ['title', 'description', 'author', 'place', 'catalogues', 'position'];
    public defaults = {
        author: undefined,
        catalogues: [],
        description: undefined,
        place: undefined,
        position: undefined,
        title: undefined
    };
    public _typesValidators = [
        isStringValidatorFactory('title'),
        isStringValidatorFactory('filename'),
        isStringValidatorFactory('src'),
        isStringValidatorFactory('description'),
        isStringValidatorFactory('author'),
        isStringValidatorFactory('place'),
        isStringValidatorFactory('type'),
        isStringValidatorFactory('size'),
        body('catalogues')
            .optional()
            .isArray()
            .withMessage('Catalogues has to be an array of strings'),
        body('catalogues.*')
            .isString()
            .withMessage('Catalogues has to be an array of strings'),
        body('position')
            .optional()
            .isNumeric()
            .withMessage('Position has to be a number')
    ];
}
