import { body } from 'express-validator/check';
import { capitalize } from 'lodash';

import { IFieldData } from '../../resources';
import { checkFieldsString } from '../functions';

export const fieldsStringValidator = body('fields').custom((fields: IFieldData[]) => {
    const invalidField = checkFieldsString(fields);
    if (invalidField) {
        throw new Error(`${capitalize(invalidField)} has to be a string`);
    }
    return true;
});
