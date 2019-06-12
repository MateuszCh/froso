import { body, ValidationChain } from 'express-validator/check';
import { capitalize, find, get } from 'lodash';

import { IResourceRequestData } from '../../resources';

export function notFalsyValidatorFactory<T extends IResourceRequestData>(fields: string[]): ValidationChain {
    return body().custom((data: T) => {
        const falsyField = find(fields, (field: string) => data.hasOwnProperty(field) && !get(data, field));
        if (falsyField) {
            throw new Error(`${capitalize(falsyField)} is required`);
        }
        return true;
    });
}
