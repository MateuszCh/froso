import { IResourceData, Resource } from './resource';

export interface IUserData extends IResourceData {
    username: string;
    password: string;
}

export class User extends Resource<IUserData> {
    public readonly type = 'user';
    public readonly collectionName = 'users';
}
