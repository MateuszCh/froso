import { IResourceData, IResourceRequestData, Resource } from './resource';

export interface IUserData extends IResourceData {
    username: string;
    password: string;
}

export interface IUserRequestData extends IResourceRequestData {
    username?: string;
    password?: string;
}

export class User extends Resource<IUserData, IUserRequestData> {
    public readonly type = 'user';
    public readonly collectionName = 'users';
}
