import { NextFunction, Request, RequestHandler, Response } from 'express';
import { isArray, isObject, mapValues, pick } from 'lodash';

import { IFilesUploadData } from '../../resources';
import { IFileRequestData } from '../../resources';

export function allowedFieldsFilesMiddlewareFactory(fields: string[]): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.files || !isArray(req.files) || !req.files.length) {
            next('There is no files to upload');
        }
        const body: IFilesUploadData = req.body;
        req.body = {};
        if (body.filesData && isObject(body.filesData)) {
            req.body.filesData = mapValues(body.filesData, fileData => pick(fileData, fields) as IFileRequestData);
        }
        next();
    };
}
