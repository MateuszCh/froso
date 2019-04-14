import { PagesController } from '../controllers';
import { IPageData, Page } from '../models';
import { AbstractRouter } from './abstract.router';

export class PagesRouter extends AbstractRouter<Page, IPageData> {
    protected controller = new PagesController();
}

const pagesRouter = new PagesRouter();

export default pagesRouter.getRouter();
