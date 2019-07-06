import { map } from 'lodash';

import { removefile } from './remove-file';

export function removeManyFiles(filesPaths: string[]): Promise<(NodeJS.ErrnoException | undefined)[]> {
    const promises = map(filesPaths, removefile);
    return Promise.all(promises);
}
