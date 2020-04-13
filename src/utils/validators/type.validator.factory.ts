import { body, ValidationChain } from 'express-validator';
import { capitalize, find, get, isArray, isNumber, isString, isUndefined } from 'lodash';

import { toArray } from '../functions';
import { IResourceRequestData } from './../../resources/resource';

export declare type CheckFunction = (value: any) => boolean;

const checkFunctions = {
    array: isArray,
    number: isNumber,
    string: isString
};

export function typeValidatorFactory<T extends IResourceRequestData>(
    fields: string[],
    type: 'number' | 'string' | 'array'
): ValidationChain {
    return body().custom((data: T | T[]) => {
        data = toArray(data);

        const checkFunction = checkFunctions[type];

        let invalidField: string | undefined;
        const invalidModel: T | undefined = find(data, (model) => {
            invalidField = findInvalidType<T>(fields, model, checkFunction);
            return !!invalidField;
        });
        if (invalidModel && invalidField) {
            throw new Error(getError(invalidField, type));
        }
        return true;
    });
}

function getError(invalidField: string, type: string): string {
    return `${capitalize(invalidField)} has to be a${type === 'array' ? 'n' : ''} ${type}`;
}

function findInvalidType<T extends IResourceRequestData>(
    fields: string[],
    model: T,
    checkFunction: CheckFunction
): string | undefined {
    return find(fields, (field) => {
        const value = get(model, field);
        return !isUndefined(value) && !checkFunction(value);
    });
}
