import { IPostData, Post } from '../resources';
import { AbstractController } from './abstract.controller';

export class PostsController extends AbstractController<IPostData> {
    public resource = new Post();
}
