import { NextFunction, Request, Response } from 'express';

export function isAuthenticatedMiddleware(req: Request, res: Response, next: NextFunction): void | Response {
    if (req.user) {
        return next();
    } else {
        return res.status(401).send({ error: 'Not authenticated' });
    }
}
