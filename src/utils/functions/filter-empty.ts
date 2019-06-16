import { isBoolean, isString, omitBy, pickBy } from 'lodash';

export function filterEmpty(data: { [key: string]: any }, invert: boolean = false): { [key: string]: any } {
    if (invert) {
        return pickBy(data, isEmpty);
    }
    return omitBy(data, isEmpty);
}

export function isEmpty(value: any): boolean {
    return !isBoolean(value) && (!value || (isString(value) && !value.trim()));
}
