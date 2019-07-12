import { RequestHandler, Router } from 'express';
import { map } from 'lodash';

import { UsersController } from '../controllers';
import { IUserData, IUserRequestData } from '../resources';
import {
    allowedFieldsMiddlewareFactory,
    asyncMiddleware,
    changePasswordValidator,
    isNumberValidatorFactory,
    isStringValidatorFactory,
    requiredValidatorFactory,
    validationMiddleware
} from '../utils';
import { AbstractRouter } from './abstract.router';

export class UsersRouter extends AbstractRouter<IUserData, IUserRequestData> {
    protected controller = new UsersController();

    public get changePasswordHandlers(): RequestHandler[] {
        return [
            requiredValidatorFactory(this.controller.changePasswordFields),
            allowedFieldsMiddlewareFactory(this.controller.changePasswordFields),
            ...map(this.controller.changePasswordFields, field =>
                field === 'id' ? isNumberValidatorFactory(field) : isStringValidatorFactory(field)
            ),
            changePasswordValidator,
            validationMiddleware,
            asyncMiddleware(this.controller.changePassword)
        ];
    }

    public getRouter(): Router {
        this.router.post('/login', this.controller.login);
        this.router.post('/logout', this.controller.logout);
        this.router.get('/isAuthenticated', this.controller.isAuthenticated);
        this.router.post('/changePassword', ...this.changePasswordHandlers);
        this.router.get('/', this.controller.getUser);

        return this.router;
    }
}

export const usersRouter = new UsersRouter();
