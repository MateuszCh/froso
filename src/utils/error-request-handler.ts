import { Application, NextFunction, Request, Response } from 'express';
import { isString } from 'lodash';

export function errorRequestHandler(app: Application) {
    app.use((err: any, req: Request, res: Response, next: NextFunction) => res.status(422).send(getError(err)));
}

export function getError(err: any): { error: any } | any {
    switch (true) {
        case isString(err):
            return { error: err };
        case isString(err.message):
            return { error: err.message };
        case !!err.errors:
            const firstError = Object.keys(err.errors)[0];
            return { error: err.errors[firstError].message };
        default:
            return err.message;
    }
}
