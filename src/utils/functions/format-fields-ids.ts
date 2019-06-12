import { map, pick } from 'lodash';

import { allowedFieldDataFields, IFieldData } from '../../resources';
import { formatId } from './format-id';

export function formatFields(fields: IFieldData[]): IFieldData[] {
    return map(fields, field => {
        const fieldData = pick({ ...field, id: formatId(field.id) }, allowedFieldDataFields) as IFieldData;
        if (fieldData.repeaterFields) {
            fieldData.repeaterFields = formatFields(fieldData.repeaterFields);
        }

        return fieldData;
    });
}
