import { IFrosoCollectionConfig } from '../Froso';

export const defaultCollections: IFrosoCollectionConfig[] = [
    {
        collectionName: 'counter',
        indexes: [{ key: { type: 1 }, unique: true }]
    },
    { collectionName: 'files', indexes: [{ key: { id: 1 }, unique: true }] },
    { collectionName: 'pages', indexes: [{ key: { id: 1 }, unique: true }, { key: { url: 1 }, unique: true }] },
    { collectionName: 'posts', indexes: [{ key: { id: 1 }, unique: true }] },
    { collectionName: 'post_types', indexes: [{ key: { id: 1 }, unique: true }] },
    { collectionName: 'users', indexes: [{ key: { username: 1 }, unique: true }] }
];
