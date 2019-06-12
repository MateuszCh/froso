import { NextFunction, Request, RequestHandler, Response } from 'express';

import { IResourceData, IResourceRequestData, Resource } from '../../resources';

export function formatResourceMiddleware<T extends IResourceData, D extends IResourceRequestData>(
    resource: Resource<T, D>
): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
        req.body = resource.formatResource(req.body);
        next();
    };
}
