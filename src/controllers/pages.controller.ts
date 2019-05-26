import { IPageData, Page } from '../resources';
import { AbstractController } from './abstract.controller';

export class PagesController extends AbstractController<IPageData> {
    public resource = new Page();
}
