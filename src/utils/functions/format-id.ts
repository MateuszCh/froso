import { isString } from 'lodash';

export function formatId(value: string): string {
    if (!value || !isString(value)) {
        return value;
    }
    return value
        .trim()
        .replace(/\s+/g, '_')
        .toLowerCase();
}
