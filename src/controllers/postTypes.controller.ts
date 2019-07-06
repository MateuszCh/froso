import { IPostTypeData, IPostTypeRequestData, Post, PostType } from '../resources';
import { AbstractController, IOnResponse, okOnResponse } from './abstract.controller';

export class PostTypesController extends AbstractController<IPostTypeData, IPostTypeRequestData> {
    public resource = new PostType();

    public postResource = new Post();

    protected async onRemove(removedResource: IPostTypeData): Promise<IOnResponse> {
        if (removedResource) {
            await this.postResource.delete({ id: { $in: removedResource.posts } });
            return okOnResponse;
        }
        return okOnResponse;
    }

    protected async onUpdate(updatedResource: IPostTypeData): Promise<IOnResponse> {
        if (updatedResource) {
            await this.postResource.update(
                { id: { $in: updatedResource.posts } },
                { $set: { type: updatedResource.type } }
            );
            return okOnResponse;
        }
        return okOnResponse;
    }
}
