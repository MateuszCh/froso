import { body, ValidationChain } from 'express-validator/check';
import { capitalize, find } from 'lodash';
import { IResourceRequestData } from '../../resources';

export function notFalsyValidator<T extends IResourceRequestData>(fields: string[], message?: string): ValidationChain {
    return body().custom((data: T) => {
        const falsyField = find(fields, (field: string) => data.hasOwnProperty(field) && !data[field]);
        if (falsyField) {
            throw new Error(`${capitalize(falsyField)} is required`);
        }
        return true;
    });
}
