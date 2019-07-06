import { IPostData, IPostRequestData, Post, PostType } from '../resources';
import { AbstractController, IOnResponse, okOnResponse } from './abstract.controller';

export class PostsController extends AbstractController<IPostData, IPostRequestData> {
    public resource = new Post();

    public postTypeResource = new PostType();

    public async onCreate(createdResource: IPostData): Promise<IOnResponse> {
        if (createdResource) {
            await this.postTypeResource.update(
                { type: createdResource.type },
                { $push: { posts: createdResource.id } }
            );
            return okOnResponse;
        }
        return okOnResponse;
    }

    public async onRemove(removedResource: IPostData): Promise<IOnResponse> {
        if (removedResource) {
            await this.postTypeResource.update(
                { type: removedResource.type },
                { $pull: { posts: removedResource.id } }
            );
            return okOnResponse;
        }
        return okOnResponse;
    }
}
