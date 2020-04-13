import { body, ValidationChain } from 'express-validator';
import { capitalize, find, get } from 'lodash';

import { IResourceRequestData } from '../../resources';
import { toArray } from '../functions';

export function requiredValidatorFactory<T extends IResourceRequestData>(fields: string[]): ValidationChain {
    return body().custom((data: T | T[]) => {
        data = toArray(data);

        let invalidField: string | undefined;
        const invalidModel: T | undefined = find(data, (model) => {
            invalidField = findFalsyField<T>(fields, model);
            return !!invalidField;
        });
        if (invalidModel && invalidField) {
            throw new Error(getError(invalidField));
        }
        return true;
    });
}

function getError(invalidField: string): string {
    return `${capitalize(invalidField)} is required`;
}

function findFalsyField<T extends IResourceRequestData>(fields: string[], model: T): string | undefined {
    return find(fields, (field) => {
        const value = get(model, field);
        return !value && value !== false;
    });
}
