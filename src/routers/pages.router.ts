import { PagesController } from '../controllers';
import { IPageData, IPageRequestData } from '../resources';
import { AbstractRouter } from './abstract.router';

export class PagesRouter extends AbstractRouter<IPageData, IPageRequestData> {
    protected controller = new PagesController();
}

const pagesRouter = new PagesRouter();

export default pagesRouter.getRouter();
