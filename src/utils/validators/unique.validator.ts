import { Request } from 'express';
import { body, ValidationChain } from 'express-validator/check';
import { find, get, map, pick } from 'lodash';

import { IResourceData, IResourceRequestData, Resource } from '../../resources';

export interface ICustomValidatorOptions {
    req: Request;
    location: string;
    path: string;
}

export function uniqueValidatorFactory<T extends IResourceData, D extends IResourceRequestData>(
    fields: string[],
    resource: Resource<T, D>
): ValidationChain {
    return body().custom(async (data: D, options: ICustomValidatorOptions) => {
        if (!fields.length) {
            return true;
        }
        const id = options.req.params.id || 0;
        const uniqueFields = pick(data, fields);
        const queryArray = map(uniqueFields, (value: any, key: string) => {
            return {
                [key]: value
            };
        });
        if (!queryArray.length) {
            return true;
        }
        const uniqueModel = await resource.findOne({ $and: [{ $or: queryArray }, { id: { $ne: id } }] });
        if (uniqueModel) {
            const duplicateField = find(fields, (key: string) => {
                return get(data, key) === get(uniqueModel, key);
            });
            if (duplicateField) {
                return Promise.reject(
                    `There already is ${resource.resourceType} with ${duplicateField}: ${get(data, duplicateField)}`
                );
            }
        }
        return true;
    });
}
