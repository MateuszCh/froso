import { IPostData, IPostRequestData, Post, PostType } from '../resources';
import { AbstractController, IOnResponse, okOnResponse } from './abstract.controller';

import { groupBy, map } from 'lodash';

export class PostsController extends AbstractController<IPostData, IPostRequestData> {
    public resource = new Post();

    public postTypeResource = new PostType();

    public async onCreate(createdResources: IPostData[]): Promise<IOnResponse> {
        if (createdResources) {
            const groupedResources = groupBy(createdResources, createdResource => createdResource.type);

            const promises = map(groupedResources, (resources: IPostData[], postType) => {
                return this.postTypeResource.update(
                    { type: postType },
                    { $push: { posts: { $each: map(resources, resource => resource.id) } } }
                );
            });

            await Promise.all(promises);

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
