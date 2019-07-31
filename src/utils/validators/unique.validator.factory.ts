import { Request } from 'express';
import { body, ValidationChain } from 'express-validator/check';
import { each, find, get, includes, map, pick } from 'lodash';

import { IResourceData, IResourceRequestData, Resource } from '../../resources';
import { toArray } from '../functions';

export interface ICustomValidatorOptions {
    req: Request;
    location: string;
    path: string;
}

export function uniqueValidatorFactory<T extends IResourceData, D extends IResourceRequestData>(
    fields: string[],
    resource: Resource<T, D>
): ValidationChain {
    return body().custom(async (data: D | D[], options: ICustomValidatorOptions) => {
        if (!fields.length) {
            return true;
        }

        data = toArray(data);

        const id = options.req.params.id || 0;

        const uniqueFieldsModels = map(data, (dataModel: D) => pick(dataModel, fields));

        const query: { [key: string]: any[] } = {};

        let duplicatedField: string = '';

        each(uniqueFieldsModels, uniqueFieldsModel => {
            if (duplicatedField) {
                return false;
            }
            each(uniqueFieldsModel, (uniqueFieldValue, uniqueFieldKey) => {
                if (uniqueFieldValue && uniqueFieldKey) {
                    const fieldValuesArray: string[] | undefined = query[uniqueFieldKey];

                    if (fieldValuesArray) {
                        if (includes(fieldValuesArray, uniqueFieldValue as any)) {
                            duplicatedField = uniqueFieldKey;
                            return false;
                        }
                        fieldValuesArray.push(uniqueFieldValue as any);
                    } else {
                        query[uniqueFieldKey] = [uniqueFieldValue];
                    }
                }
                return;
            });
            return;
        });

        if (duplicatedField) {
            return Promise.reject(`There are more than one models with unique field: ${duplicatedField}`);
        }

        const queryArray = map(query, (values, key) => {
            return {
                [key]: { $in: values }
            };
        });

        try {
            const uniqueModel = await resource.findOne({ $and: [{ $or: queryArray }, { id: { $ne: id } }] });
            if (uniqueModel) {
                const duplicateField = find(fields, (key: string) => {
                    const uniqueValue = get(uniqueModel, key);
                    return uniqueValue && query[key] && query[key].includes(uniqueValue);
                });
                if (duplicateField) {
                    return Promise.reject(
                        `There already is ${resource.resourceType} with ${duplicateField}: ${get(
                            uniqueModel,
                            duplicateField
                        )}`
                    );
                }
            }
        } catch (err) {
            return true;
        }
        return true;
    });
}
