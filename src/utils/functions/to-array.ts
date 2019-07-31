import { isArray } from 'lodash';

export function toArray(data: any | any[]): any[] {
    return isArray(data) ? data : [data];
}
