import { PostTypesController } from '../controllers';
import { IPostTypeData, PostType } from '../models';
import { AbstractRouter } from './abstract.router';

export class PostTypesRouter extends AbstractRouter<PostType, IPostTypeData> {
    protected controller = new PostTypesController();
}

const postTypesRouter = new PostTypesRouter();

export default postTypesRouter.getRouter();
