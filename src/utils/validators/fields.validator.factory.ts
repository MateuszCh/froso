import { body, ValidationChain } from 'express-validator';
import { capitalize, compact, first, map } from 'lodash';

import { IFieldData, IPostTypeRequestData } from '../../resources';
import { checkFieldsIds, checkFieldsRequired, checkFieldsString, toArray } from '../functions';

const checkFunctions = {
    id: checkFieldsIds,
    required: checkFieldsRequired,
    string: checkFieldsString
};

export function fieldsValidatorFactory(type: 'id' | 'required' | 'string'): ValidationChain {
    return body().custom((data: IPostTypeRequestData | IPostTypeRequestData[]) => {
        const checkFunction = checkFunctions[type];

        data = toArray(data);

        const invalidField = first(
            compact(
                map(
                    data.filter((dataModel) => !!dataModel.fields),
                    (modelWithFields) => checkFunction(modelWithFields.fields as IFieldData[])
                )
            )
        );

        if (invalidField) {
            throw new Error(getError(invalidField === true ? '' : invalidField, type));
        }
        return true;
    });
}

function getError(invalidField: string, type: 'id' | 'required' | 'string'): string {
    switch (type) {
        case 'id':
            return 'Each field in the same level should have a different id';
        case 'required':
            return `${capitalize(invalidField)} is required`;
        case 'string':
            return `${capitalize(invalidField)} has to be a string`;
    }
}
