import { NextFunction, Request, RequestHandler, Response } from 'express';
import { map, pick } from 'lodash';

import { toArray } from '../functions';
import { IResourceRequestData } from './../../resources';

export function allowedFieldsMiddlewareFactory<D extends IResourceRequestData>(fields: string[]): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
        const bodyArray: D[] = toArray<D>(req.body);
        req.body = map(bodyArray, dataModel => pick(dataModel, fields));
        next();
    };
}
