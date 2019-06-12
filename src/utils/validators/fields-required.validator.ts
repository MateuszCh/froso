import { body } from 'express-validator/check';
import { capitalize } from 'lodash';

import { IFieldData } from '../../resources';
import { checkFieldsRequired } from '../functions';

export const fieldsRequiredValidator = body('fields').custom((fields: IFieldData[]) => {
    const areFieldsRequiredInvalid = checkFieldsRequired(fields);
    if (areFieldsRequiredInvalid) {
        throw new Error(`${capitalize(areFieldsRequiredInvalid)} is required`);
    }
    return true;
});
