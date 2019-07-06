import { body, ValidationChain } from 'express-validator/check';
import { each, get, map, set } from 'lodash';

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
    size: number;
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
    size?: number;
    catalogues?: string[];
    position?: number;
}

export interface IFilesUploadData {
    filesData: { [key: string]: IFileRequestData };
}

const ARRAY_OF_STRINGS_ERROR_MESSAGE = 'Catalogues has to be an array of strings';

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
        body('size')
            .optional()
            .isNumeric()
            .withMessage('Size has to be a number'),
        body('catalogues')
            .optional()
            .isArray()
            .withMessage(ARRAY_OF_STRINGS_ERROR_MESSAGE),
        body('catalogues.*')
            .isString()
            .withMessage(ARRAY_OF_STRINGS_ERROR_MESSAGE),
        body('position')
            .optional()
            .isNumeric()
            .withMessage('Position has to be a number')
    ];

    public get createValidators(): ValidationChain[] {
        return [
            isStringValidatorFactory('filesData.*.title'),
            isStringValidatorFactory('filesData.*.description'),
            isStringValidatorFactory('filesData.*.author'),
            isStringValidatorFactory('filesData.*.place'),
            body('filesData.*.catalogues')
                .optional()
                .isArray()
                .withMessage(ARRAY_OF_STRINGS_ERROR_MESSAGE),
            body('filesData.*.catalogues.*')
                .optional()
                .isString()
                .withMessage(ARRAY_OF_STRINGS_ERROR_MESSAGE),
            body('filesData.*.position')
                .optional()
                .isNumeric()
                .withMessage('Position has to be a number')
        ];
    }

    public formatUploadingFiles = (files: Express.Multer.File[], filesData?: IFilesUploadData): IFileRequestData[] => {
        return map(files, file => {
            const model: IFileRequestData = {
                filename: file.filename,
                size: file.size,
                src: `/uploads/${file.filename}`,
                type: file.mimetype
            };
            if (filesData && model.filename) {
                const fileData: IFileRequestData | undefined = get(filesData, model.filename);

                if (fileData) {
                    each(this.notRequiredFields, fieldName => {
                        const value = get(fileData, fieldName);
                        if (value) {
                            if (fieldName === 'catalogues') {
                                set(model, fieldName, map(value, (catalogue: string) => catalogue.toLowerCase()));
                            } else {
                                set(model, fieldName, value);
                            }
                        }
                    });
                }
            }
            return model;
        });
    };
}
