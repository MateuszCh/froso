import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as fs from 'fs';
import { includes, map } from 'lodash';
import * as multer from 'multer';
import * as path from 'path';

import { FrosoFile, IFileData } from '../resources';

export interface IFrosoMulterConfig {
    directory?: string;
    fileTypes?: RegExp;
    limits?: IMulterLimits;
    customMulter?: FrosoMulter;
}

export interface IMulterLimits {
    fieldNameSize?: number;
    fieldSize?: number;
    fields?: number;
    fileSize?: number;
    files?: number;
    parts?: number;
    headerPairs?: number;
    preservePath?: boolean;
}

export class FrosoMulter {
    protected currentlyUploading: string[] = [];
    protected filenames: string[] = [];

    protected fileResource = new FrosoFile();

    constructor(
        public directory: string,
        public fileTypes: RegExp = /jpeg|jpg|png|gif|pdf/,
        public limits: IMulterLimits = { fileSize: 10000000 }
    ) {
        if (!fs.existsSync(this.directory)) {
            fs.mkdirSync(directory);
        }
    }

    public setFilenames: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
        this.filenames = [];
        this.currentlyUploading = [];

        this.fileResource
            .find()
            .then((files: IFileData[]) => {
                this.filenames = map(files, file => file.filename);
                next();
            })
            .catch(() => {
                next('There was error uploading files');
            });
    };

    public filename(
        req: Request,
        file: Express.Multer.File,
        callback: (error: Error | null, filename: string) => void
    ) {
        callback(null, file.originalname);
    }

    public fileFilter = (
        req: Request,
        file: Express.Multer.File,
        callback: (error: Error | null, acceptFile: boolean) => void
    ) => {
        if (includes(this.filenames, file.originalname)) {
            callback(Error(`${file.originalname} already exists`), false);
        } else if (includes(this.currentlyUploading, file.originalname)) {
            callback(Error(`You are trying to upload two files with the same filename: ${file.originalname}`), false);
        }

        const extname = this.fileTypes.test(path.extname(file.originalname).toLowerCase());

        const mimetype = this.fileTypes.test(file.mimetype);
        if (mimetype && extname) {
            this.currentlyUploading.push(file.originalname);
            return callback(null, true);
        } else {
            return callback(Error(`Error: Wrong file type ${file.originalname}`), false);
        }
    };

    public upload = () => {
        return multer({
            fileFilter: this.fileFilter,
            limits: this.limits,
            storage: multer.diskStorage({
                destination: this.directory,
                filename: this.filename
            })
        });
    };
}
