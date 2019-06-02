import { IPageData, IPageRequestData, Page } from '../resources';
import { AbstractController } from './abstract.controller';

export class PagesController extends AbstractController<IPageData, IPageRequestData> {
    public resource = new Page();
}
