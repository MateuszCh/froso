import { IModelData, Model } from './model';

export interface IPageData extends IModelData {}

export class Page extends Model {
    public static readonly type = 'page';

    constructor(protected data: IPageData) {
        super(data);
    }
}
