import { PostsController } from '../controllers';
import { IPostData, IPostRequestData } from '../resources';
import { AbstractRouter } from './abstract.router';

export class PostsRouter extends AbstractRouter<IPostData, IPostRequestData> {
    protected controller = new PostsController();
}

export const postsRouter = new PostsRouter();
