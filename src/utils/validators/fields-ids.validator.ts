import { body } from 'express-validator/check';

import { IFieldData } from '../../resources';
import { checkFieldsIds } from '../functions';

export const fieldsIdsValidator = body('fields').custom((fields: IFieldData[]) => {
    const areFieldsIdsInvalid = checkFieldsIds(fields);
    if (areFieldsIdsInvalid) {
        throw new Error('Each field in the same level should have a different id');
    }
    return true;
});
