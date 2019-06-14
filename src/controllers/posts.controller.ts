import { UpdateWriteOpResult } from 'mongodb';

import { IPostData, IPostRequestData, Post, PostType } from '../resources';
import { AbstractController } from './abstract.controller';

export class PostsController extends AbstractController<IPostData, IPostRequestData> {
    public resource = new Post();

    public postTypeResource = new PostType();

    public onCreate = async (createdResource: IPostData): Promise<UpdateWriteOpResult | true> => {
        if (createdResource) {
            return this.postTypeResource.update(
                { type: createdResource.type },
                { $push: { posts: createdResource.id } }
            );
        }
        return true;
    };

    public onRemove = async (removedResource: IPostData): Promise<UpdateWriteOpResult | true> => {
        if (removedResource) {
            return this.postTypeResource.update(
                { type: removedResource.type },
                { $pull: { posts: removedResource.id } }
            );
        }
        return true;
    };
}
