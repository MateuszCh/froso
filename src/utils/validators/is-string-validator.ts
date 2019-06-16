import { body, ValidationChain } from 'express-validator/check';
import { capitalize } from 'lodash';

export function isStringValidatorFactory(field: string): ValidationChain {
    return body(field)
        .optional()
        .isString()
        .withMessage(`${capitalize(field)} has to be a string`);
}
