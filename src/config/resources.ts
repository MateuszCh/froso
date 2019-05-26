import { IResourceCollection } from '../resources';

export const resources: { [key: string]: IResourceCollection } = {
    counter: { collectionName: 'counters', indexes: [{ key: { type: 1 }, unique: true }] },
    file: { collectionName: 'files', indexes: [{ key: { id: 1 }, unique: true }] },
    page: { collectionName: 'pages', indexes: [{ key: { id: 1 }, unique: true }, { key: { url: 1 }, unique: true }] },
    post: { collectionName: 'posts', indexes: [{ key: { id: 1 }, unique: true }] },
    post_type: { collectionName: 'post_types', indexes: [{ key: { id: 1 }, unique: true }] },
    users: { collectionName: 'users', indexes: [{ key: { username: 1 }, unique: true }] }
};
