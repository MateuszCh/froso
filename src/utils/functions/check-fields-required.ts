import { find, get } from 'lodash';

import { IFieldData, requiredFieldDataFields } from '../../resources';

export function checkFieldsRequired(fields: IFieldData[]): string | false {
    const invalidRequiredField = find(requiredFieldDataFields, requiredField =>
        checkFieldRequired(fields, requiredField)
    );

    if (invalidRequiredField) {
        return invalidRequiredField;
    }
    return false;
}

export function checkFieldRequired(fields: IFieldData[], requiredField: string): boolean {
    if (!fields || !fields.length) {
        return false;
    }
    const invalidField = !!find(fields, field => !get(field, requiredField));
    if (invalidField) {
        return true;
    }
    return !!find(fields, field => {
        if (field.repeaterFields && field.repeaterFields.length) {
            return checkFieldRequired(field.repeaterFields, requiredField);
        }
        return false;
    });
}
