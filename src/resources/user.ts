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
    public readonly resourceType = 'user';
    public readonly collectionName = 'users';
    public defaults = {};
    public requiredFields = ['username', 'password'];
}
