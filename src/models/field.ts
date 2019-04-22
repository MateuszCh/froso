import { IModelData, Model } from './model';

export interface IFieldData extends IModelData {
    title: string;
    type: string;
    id: string;
    selectOptions?: string;
    multiselectOptions?: string;
    repeaterFields?: IFieldData[];
}

export class Field extends Model {
    public static readonly type = 'field';

    constructor(protected data: IFieldData) {
        super(data);
    }
}
