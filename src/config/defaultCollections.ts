import { IFrosoCollectionConfig } from './mongo';

export const defaultCollections: IFrosoCollectionConfig[] = [
    {
        collectionName: 'counters',
        indexes: [{ key: { collectionName: 1 }, unique: true }]
    },
    { collectionName: 'files', indexes: [{ key: { id: 1 }, unique: true }], counter: true },
    {
        collectionName: 'pages',
        counter: true,
        indexes: [{ key: { id: 1 }, unique: true }, { key: { url: 1 } }]
    },
    { collectionName: 'posts', indexes: [{ key: { id: 1 }, unique: true }], counter: true },
    { collectionName: 'post_types', indexes: [{ key: { id: 1 }, unique: true }], counter: true },
    { collectionName: 'users', indexes: [{ key: { username: 1 }, unique: true }], counter: true }
];
