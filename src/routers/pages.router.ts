import { PagesController } from '../controllers';
import { IPageData } from '../resources';
import { AbstractRouter } from './abstract.router';

export class PagesRouter extends AbstractRouter<IPageData> {
    protected controller = new PagesController();
}

const pagesRouter = new PagesRouter();

export default pagesRouter.getRouter();
