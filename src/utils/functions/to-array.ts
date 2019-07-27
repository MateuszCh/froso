import { isArray } from 'lodash';

import { IResourceRequestData } from './../../resources/resource';

export function toArray<T extends IResourceRequestData = IResourceRequestData>(data: T | T[]): T[] {
    return isArray(data) ? data : [data];
}
