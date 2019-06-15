import { IResourceData, IResourceRequestData, Resource } from './resource';

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

export interface IFileRequestData extends IResourceRequestData {
    title?: string;
    filename?: string;
    src?: string;
    description?: string;
    author?: string;
    place?: string;
    type?: string;
    size?: string;
    catalogues?: string[];
    position?: number;
}

export class FrosoFile extends Resource<IFileData, IFileRequestData> {
    public readonly resourceType = 'file';
    public readonly collectionName = 'files';
    public requiredFields = ['filename'];
    public notRequiredFields = ['title', 'description', 'author', 'place', 'catalogues', 'position'];
    public defaults = {
        author: undefined,
        catalogoues: [],
        description: undefined,
        place: undefined,
        position: undefined,
        title: undefined
    };
}
