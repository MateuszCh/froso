import { Application, Request, Response } from 'express';
import * as morgan from 'morgan';
import { Logger } from 'winston';

export function initMorgan(express: Application, logger: Logger): void {
    express.use(
        morgan('combined', {
            skip: (req: Request, res: Response) => res.statusCode >= 400,
            stream: { write: (message: string) => logger.info(message) },
        }),
    );

    express.use(
        morgan('combined', {
            skip: (req: Request, res: Response) => res.statusCode < 400,
            stream: { write: (message: string) => logger.error(message) },
        }),
    );
}
