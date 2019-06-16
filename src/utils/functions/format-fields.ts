import { compact, isArray, map, pick } from 'lodash';

import { allowedFieldDataFields, IFieldData } from '../../resources';
import { filterEmpty } from './filter-empty';
import { formatId } from './format-id';

export function formatFields(fields: IFieldData[]): IFieldData[] {
    if (!isArray(fields)) {
        return [];
    }
    return map(fields, field => {
        const fieldData = filterEmpty(pick({ ...field }, allowedFieldDataFields)) as IFieldData;
        if (fieldData.id) {
            fieldData.id = formatId(fieldData.id);
        }
        if (fieldData.selectOptions) {
            fieldData.options = formatOptions(fieldData.selectOptions);
        }
        if (fieldData.multiselectOptions) {
            fieldData.multiOptions = formatOptions(fieldData.multiselectOptions);
        }
        if (fieldData.repeaterFields) {
            fieldData.repeaterFields = formatFields(fieldData.repeaterFields);
        }

        return fieldData;
    });
}

export function formatOptions(options: string): string[] {
    return compact(
        options
            .replace(/\s*;\s*/g, ';')
            .split(';')
            .map(option => option.replace(/;/g, ''))
    );
}
