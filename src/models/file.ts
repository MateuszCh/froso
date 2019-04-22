import { IModelData, Model } from './model';

export interface IFileData extends IModelData {
    title?: string;
    filename: string;
    src: string;
    description?: string;
    author?: string;
    place?: string;
    type: string;
    size: string;
    catalogues?: string[];
    position?: number;
}

export class File extends Model {
    public static readonly type = 'file';

    constructor(protected data: IFileData) {
        super(data);
    }
}
