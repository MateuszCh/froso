import { find, map, uniq } from 'lodash';

import { IFieldData } from '../../resources';

export function checkFieldsIds(fields: IFieldData[]): boolean {
    if (!fields || !fields.length) {
        return false;
    }
    const ids = map(fields, field => field.id);
    const uniqIds = uniq(ids);
    if (ids.length !== uniqIds.length) {
        return true;
    }

    return !!find(fields, field => {
        if (field.repeaterFields && field.repeaterFields.length) {
            return checkFieldsIds(field.repeaterFields);
        }
        return false;
    });
}
