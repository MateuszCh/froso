import { body } from 'express-validator/check';
import { capitalize } from 'lodash';

import { IFieldData } from '../../resources';
import { checkFieldsRequired } from '../functions';

export const fieldsRequiredValidator = body('fields').custom((fields: IFieldData[]) => {
    const invalidField = checkFieldsRequired(fields);
    if (invalidField) {
        throw new Error(`${capitalize(invalidField)} is required`);
    }
    return true;
});
