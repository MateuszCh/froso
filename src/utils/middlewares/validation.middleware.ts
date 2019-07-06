import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator/check';
import { isArray, map } from 'lodash';

import { removeManyFiles } from '../functions';

export interface IValidationError {
    location: Location;
    param: string;
    msg: any;
    value: any;
}

export async function validationMiddleware(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const result = validationResult<IValidationError>(req);

    if (result.isEmpty()) {
        return next();
    } else {
        if (req.files && isArray(req.files) && req.files.length) {
            const filesToRemove: string[] = map(req.files, file => `${file.destination}/${file.filename}`);
            try {
                await removeManyFiles(filesToRemove);
            } catch (err) {
                // do nothing
            }
        }
        return res.status(422).send({ error: result.array()[0].msg });
    }
}
