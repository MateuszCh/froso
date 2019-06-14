import { body, ValidationChain } from 'express-validator/check';

import { IPostRequestData, PostType } from '../../resources';

export const postTypeExistsValidator: ValidationChain = body().custom(async (data: IPostRequestData) => {
    const postTypeResource = new PostType();
    if (data.type) {
        const postType = await postTypeResource.findOne({ type: data.type });
        if (postType) {
            return true;
        } else {
            return Promise.reject(`There is no ${data.type} post type.`);
        }
    }
    return true;
});
