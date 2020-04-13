import { body } from 'express-validator';

import { IChangePasswordRequest } from './../../controllers/users.controller';

export const changePasswordValidator = body().custom((data: IChangePasswordRequest) => {
    if (data.newPassword !== data.newPasswordConfirmation) {
        // tslint:disable-next-line: quotemark
        throw new Error("Passwords don't match.");
    }
    return true;
});
