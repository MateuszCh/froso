import { body, Validator } from 'express-validator/check';

export function requiredValidator(field: string, message?: string): Validator {
    return body(field)
        .exists({ checkFalsy: true })
        .withMessage(message || `${field.toUpperCase()} is required`);
}
