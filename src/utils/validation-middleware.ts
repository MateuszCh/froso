import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator/check';

export interface IValidationError {
    location: Location;
    param: string;
    msg: any;
    value: any;
}

export function validationMiddleware(req: Request, res: Response, next: NextFunction): Response | void {
    const result = validationResult<IValidationError>(req);

    return result.isEmpty() ? next() : res.status(422).send({ error: result.array()[0].msg });
}
