import { find, get, isString } from 'lodash';

import { IFieldData, stringFieldDataFields } from '../../resources';

export function checkFieldsString(fields: IFieldData[]): string | false {
    const notStringField = find(stringFieldDataFields, stringField => checkFieldString(fields, stringField));
    if (notStringField) {
        return notStringField;
    }
    return false;
}

export function checkFieldString(fields: IFieldData[], stringField: string): boolean {
    if (!fields || !fields.length) {
        return false;
    }
    const notStringField = !!find(fields, field => {
        const value = get(field, stringField);
        return value && !isString(value);
    });
    if (notStringField) {
        return true;
    }
    return !!find(fields, field => {
        if (field.repeaterFields && field.repeaterFields.length) {
            return checkFieldString(field.repeaterFields, stringField);
        }
        return false;
    });
}
