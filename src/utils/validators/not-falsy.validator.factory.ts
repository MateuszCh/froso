import { body, ValidationChain } from 'express-validator';
import { capitalize, find, get } from 'lodash';

import { IResourceRequestData } from '../../resources';
import { toArray } from '../functions';

export function notFalsyValidatorFactory<T extends IResourceRequestData>(fields: string[]): ValidationChain {
    return body().custom((data: T[]) => {
        data = toArray(data);

        const falsyField = find(fields, (field) =>
            find(data as T[], (dataModel) => dataModel.hasOwnProperty(field) && !get(dataModel, field))
        ) as string | undefined;

        if (falsyField) {
            throw new Error(`${capitalize(falsyField)} is required`);
        }
        return true;
    });
}
