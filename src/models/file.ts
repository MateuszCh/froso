import { IModelData, Model } from './model';

export interface IFileData extends IModelData {}

export class File extends Model {
    public static readonly type = 'file';

    constructor(protected data: IFileData) {
        super(data);
    }
}
