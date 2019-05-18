import * as fs from 'fs';
import * as path from 'path';
import { createLogger, Logger } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const logsDirectory = path.resolve(__dirname, '../../', 'logs');
const errorDirectory = path.resolve(logsDirectory, 'error');
const infoDirectory = path.resolve(logsDirectory, 'info');

if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory);
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

const logger: Logger = createLogger({ transports: [errorTransport, infoTransport] });

export default logger;
