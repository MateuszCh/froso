import * as fs from 'fs';
import * as path from 'path';
import { createLogger, Logger } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

export function getLogger(logsDirectory?: string): Logger {
    const mainDirectory = logsDirectory || path.resolve(__dirname, '../../', 'logs');

    const errorDirectory = path.resolve(mainDirectory, 'error');
    const infoDirectory = path.resolve(mainDirectory, 'info');

    if (!fs.existsSync(mainDirectory)) {
        fs.mkdirSync(mainDirectory);
    }

    if (!fs.existsSync(infoDirectory)) {
        fs.mkdirSync(infoDirectory);
    }
    if (!fs.existsSync(errorDirectory)) {
        fs.mkdirSync(errorDirectory);
    }

    const errorTransport = new DailyRotateFile({
        datePattern: 'YYYY-MM-DD',
        dirname: errorDirectory,
        filename: '%DATE%-error.log',
        level: 'error',
        maxFiles: '30d',
    });

    const infoTransport = new DailyRotateFile({
        datePattern: 'YYYY-MM-DD',
        dirname: infoDirectory,
        filename: '%DATE%-info.log',
        level: 'info',
        maxFiles: '30d',
    });

    return createLogger({ transports: [errorTransport, infoTransport] });
}
