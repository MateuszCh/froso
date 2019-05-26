import { IResourceData, Resource } from './resource';

export interface IFileData extends IResourceData {
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

export class File extends Resource<IFileData> {
    public readonly type = 'file';
    public readonly collectionName = 'files';
    public readonly validators = [];
}
