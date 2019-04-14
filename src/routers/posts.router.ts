import { PostsController } from '../controllers';
import { IPostData, Post } from '../models';
import { AbstractRouter } from './abstract.router';

export class PostsRouter extends AbstractRouter<Post, IPostData> {
    protected controller = new PostsController();
}

const postsRouter = new PostsRouter();

export default postsRouter.getRouter();
