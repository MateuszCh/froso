import * as fs from 'fs';

export function removefile(filePath: string): Promise<NodeJS.ErrnoException | undefined> {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
