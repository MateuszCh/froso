import { body, ValidationChain } from 'express-validator/check';
import { capitalize } from 'lodash';

export function isNumberValidatorFactory(field: string): ValidationChain {
    return body(field)
        .optional()
        .isNumeric()
        .withMessage(`${capitalize(field)} has to be a number`);
}
