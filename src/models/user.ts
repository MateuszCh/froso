import { IModelData, Model } from './model';

export interface IUserData extends IModelData {}

export class User extends Model {
    public static readonly type = 'user';

    constructor(protected data: IUserData) {
        super(data);
    }
}
