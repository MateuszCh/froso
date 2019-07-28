import { NextFunction, Request, RequestHandler, Response } from 'express';
import { isArray, map, pick } from 'lodash';

import { toArray } from '../functions';
import { IResourceRequestData } from './../../resources';

export function allowedFieldsMiddlewareFactory<D extends IResourceRequestData>(fields: string[]): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
        const singleMode = !isArray(req.body);
        const bodyArray: D[] = toArray<D>(req.body);
        const models = map(bodyArray, dataModel => pick(dataModel, fields));
        req.body = singleMode ? models[0] : models;
        next();
    };
}
