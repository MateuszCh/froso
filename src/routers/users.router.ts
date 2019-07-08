import { Router } from 'express';

import { UsersController } from '../controllers';
import { IUserData, IUserRequestData } from '../resources';
import { asyncMiddleware } from '../utils';
import { AbstractRouter } from './abstract.router';

export class UsersRouter extends AbstractRouter<IUserData, IUserRequestData> {
    protected controller = new UsersController();

    public getRouter(): Router {
        this.router.post('/login', this.controller.login);
        this.router.post('/logout', this.controller.logout);
        this.router.get('/isAuthenticated', this.controller.isAuthenticated);
        this.router.post('/changePassword', asyncMiddleware(this.controller.changePassword));

        return this.router;
    }
}

export const usersRouter = new UsersRouter();
