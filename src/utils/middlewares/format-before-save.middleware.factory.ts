import { NextFunction, Request, RequestHandler, Response } from 'express';
import { isArray } from 'lodash';

import { IResourceData, IResourceRequestData, Resource } from '../../resources';

export function formatBeforeSaveMiddlewareFactory<T extends IResourceData, D extends IResourceRequestData>(
    resource: Resource<T, D>
): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
        const singleMode = !isArray(req.body);

        req.body = singleMode ? resource.formatBeforeSave(req.body) : resource.formatManyBeforeSave(req.body);
        next();
    };
}
