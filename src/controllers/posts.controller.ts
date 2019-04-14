import { IModelConstructor, IPostData, Post } from '../models';
import { AbstractController } from './abstract.controller';

export class PostsController extends AbstractController<Post, IPostData> {
    public modelConstructor: IModelConstructor<Post, IPostData> = Post;
    protected readonly resourceType: string = 'posts';
}
