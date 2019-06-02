import { PostTypesController } from '../controllers';
import { IPostTypeData, IPostTypeRequestData } from '../resources';
import { AbstractRouter } from './abstract.router';

export class PostTypesRouter extends AbstractRouter<IPostTypeData, IPostTypeRequestData> {
    protected controller = new PostTypesController();
}

const postTypesRouter = new PostTypesRouter();

export default postTypesRouter.getRouter();
