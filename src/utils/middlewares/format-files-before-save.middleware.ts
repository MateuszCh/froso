import { NextFunction, Request, RequestHandler, Response } from 'express';
import { isArray } from 'lodash';

import { FrosoFile } from './../../resources';

export function formatFilesBeforeSaveMiddlewareFactory<T extends FrosoFile>(resource: T): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.files && isArray(req.files)) {
            req.body.filesData = resource.formatUploadingFiles(req.files, req.body.filesData);
        }
        next();
    };
}
