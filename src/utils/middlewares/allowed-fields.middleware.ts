import { NextFunction, Request, RequestHandler, Response } from 'express';
import { pick } from 'lodash';

export function allowedFieldsMiddleware(fields: string[]): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
        req.body = pick(req.body, fields);
        next();
    };
}