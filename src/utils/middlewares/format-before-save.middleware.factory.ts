import { NextFunction, Request, RequestHandler, Response } from 'express';

import { IResourceData, IResourceRequestData, Resource } from '../../resources';
import { toArray } from '../functions';

export function formatBeforeSaveMiddlewareFactory<T extends IResourceData, D extends IResourceRequestData>(
    resource: Resource<T, D>
): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
        const bodyArray: D[] = toArray<D>(req.body);

        req.body = resource.formatManyBeforeSave(bodyArray);
        next();
    };
}
