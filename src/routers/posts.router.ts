import { PostsController } from '../controllers';
import { IPostData } from '../resources';
import { AbstractRouter } from './abstract.router';

export class PostsRouter extends AbstractRouter<IPostData> {
    protected controller = new PostsController();
}

const postsRouter = new PostsRouter();

export default postsRouter.getRouter();
