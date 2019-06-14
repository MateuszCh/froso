import { DeleteWriteOpResultObject, UpdateWriteOpResult } from 'mongodb';

import { IPostTypeData, IPostTypeRequestData, Post, PostType } from '../resources';
import { AbstractController } from './abstract.controller';

export class PostTypesController extends AbstractController<IPostTypeData, IPostTypeRequestData> {
    public resource = new PostType();

    public postResource = new Post();

    protected onRemove = async (removedResource: IPostTypeData): Promise<DeleteWriteOpResultObject | true> => {
        if (removedResource) {
            return this.postResource.delete({ id: { $in: removedResource.posts } });
        }
        return true;
    };

    protected onUpdate = async (updatedResource: IPostTypeData): Promise<UpdateWriteOpResult | true> => {
        if (updatedResource) {
            return this.postResource.update(
                { id: { $in: updatedResource.posts } },
                { $set: { type: updatedResource.type } }
            );
        }
        return true;
    };
}
