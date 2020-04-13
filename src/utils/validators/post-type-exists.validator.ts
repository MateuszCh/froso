import { body, ValidationChain } from 'express-validator';
import { compact, difference, map } from 'lodash';

import { IPostRequestData, PostType } from '../../resources';
import { toArray } from '../functions';

export const postTypeExistsValidator: ValidationChain = body().custom(
    async (data: IPostRequestData | IPostRequestData[]) => {
        const postTypeResource = new PostType();

        data = toArray(data);

        const postTypes = compact(map(data, (dataModel) => dataModel.type));

        if (postTypes.length) {
            const postTypesModels = await postTypeResource.find({ type: { $in: postTypes } });

            const foundPostTypes = map(postTypesModels, (postTypeModel) => postTypeModel.type);
            const notFoundPostTypes = difference(postTypes, foundPostTypes);

            if (notFoundPostTypes.length) {
                return Promise.reject(`There is no ${notFoundPostTypes[0]} post type`);
            }
        }
        return true;
    }
);
