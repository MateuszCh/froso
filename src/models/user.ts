import { IModelData, Model } from './model';

export interface IUserData extends IModelData {
    username: string;
    password: string;
}

export class User extends Model {
    public static readonly type = 'user';

    constructor(protected data: IUserData) {
        super(data);
    }
}
