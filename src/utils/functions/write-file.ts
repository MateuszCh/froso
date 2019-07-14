import * as fs from 'fs';

export function writeFile(filePath: string, data: any): Promise<NodeJS.ErrnoException | undefined> {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
