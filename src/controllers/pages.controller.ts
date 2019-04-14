import { IModelConstructor, IPageData, Page } from '../models';
import { AbstractController } from './abstract.controller';

export class PagesController extends AbstractController<Page, IPageData> {
    public modelConstructor: IModelConstructor<Page, IPageData> = Page;
    protected readonly resourceType: string = 'pages';
}
