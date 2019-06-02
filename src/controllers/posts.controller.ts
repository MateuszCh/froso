import { IPostData, IPostRequestData, Post } from '../resources';
import { AbstractController } from './abstract.controller';

export class PostsController extends AbstractController<IPostData, IPostRequestData> {
    public resource = new Post();
}
