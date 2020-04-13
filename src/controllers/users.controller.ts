import * as bcryptjs from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { compact, each, includes, isString, map, pick, uniqBy } from 'lodash';
import * as passport from 'passport';

import { ICounterData, IUserData, IUserRequestData, User } from '../resources';
import { AbstractController, OnResponseStatus } from './abstract.controller';

export interface IChangePasswordRequest {
    id: number;
    password: string;
    newPassword: string;
    newPasswordConfirmation: string;
}

export class UsersController extends AbstractController<IUserData, IUserRequestData> {
    public resource = new User();

    public changePasswordFields = ['id', 'password', 'newPassword', 'newPasswordConfirmation'];

    public login = (req: Request, res: Response, next: NextFunction): Response | void => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).send(info.message);
            }
            req.logIn(user, loginErr => {
                if (loginErr) {
                    return next(loginErr);
                }
                return res.send({ username: user.username, id: user.id });
            });
        })(req, res, next);
    };

    public logout = (req: Request, res: Response, next: NextFunction): Response => {
        req.logout();
        return res.send('User logged out');
    };

    public isAuthenticated = (req: Request, res: Response, next: NextFunction): Response => {
        if (req.user) {
            return res.send('Authenticated');
        } else {
            return res.status(401).send({ error: 'Not authenticated' });
        }
    };

    public changePassword = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const body: IChangePasswordRequest = req.body;

        const { id, password, newPassword } = body;

        const user = await this.resource.findById(id);
        if (!user) {
            return next(`There is no user with id: ${id}`);
        }

        const compareResult = await bcryptjs.compare(password, user.password);
        if (compareResult) {
            const salt = await bcryptjs.genSalt(12);
            const hash = await bcryptjs.hash(newPassword, salt);
            user.password = hash;
            await this.resource.updateById(id, user);
            return res.send('Password changed');
        } else {
            return res.status(401).send({ error: 'Wrong password' });
        }
    };

    public getUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const user = req.user as IUserData | undefined;
        if (user) {
            return res.send({ username: user.username, id: user.id });
        } else {
            return res.send(undefined);
        }
    };

    public createUsers = async (usersData: IUserRequestData[]): Promise<void | IUserData[]> => {
        const validUsers =
            usersData &&
            uniqBy(
                usersData.filter(
                    user => user.username && user.password && isString(user.username) && isString(user.password)
                ),
                user => user.username
            );
        if (!validUsers || !validUsers.length) {
            console.log('There is no users to create');
            return;
        }
        const usernames = getUsernames(validUsers);
        const existingUsers = await this.resource.find({ username: { $in: usernames } });
        const existingUsernames = getUsernames(existingUsers);
        const collectionName = this.resource.collectionName;

        let counter = await this.counter.findByCollectionName(collectionName);

        if (!counter) {
            const counterResult = await this.counter.create({ collectionName });
            counter = counterResult.ops[0] as ICounterData;
        }

        const counterValue = counter.counter;

        const usersToCreate = map(
            compact(
                map(validUsers, validUser => {
                    if (validUser.username && validUser.password && !includes(existingUsernames, validUser.username)) {
                        return pick(validUser, this.resource.allowedFields);
                    } else {
                        console.log(`${validUser.username} already exists`);
                        return undefined;
                    }
                })
            ),
            (user, i) => {
                user.id = counterValue + i;
                return user;
            }
        );

        if (!usersToCreate.length) {
            return;
        }

        await this.counter.incrementCounter(collectionName, usersToCreate.length);

        const salts = await Promise.all(map(usersToCreate, () => bcryptjs.genSalt(12)));
        const hashes = await Promise.all(
            map(usersToCreate, (user, i) => {
                return bcryptjs.hash(user.password as string, salts[i]);
            })
        );

        const usersModels = map(usersToCreate, (user, i) => {
            return { ...user, password: hashes[i] };
        });

        const createResult = await this.resource.createMany(usersModels);

        if (createResult.result.ok && createResult.result.ok === 1) {
            const newUsers: IUserData[] = createResult.ops;

            const onCreateResult = await this.onCreate(newUsers);

            const { status, error, response } = onCreateResult;
            if (status === OnResponseStatus.Error) {
                console.log(error);
            } else if (status === OnResponseStatus.Response) {
                console.log(response);
            } else {
                each(newUsers, newUser => console.log(`${newUser.username} was created successfully`));
            }
            return newUsers;
        } else {
            console.log('There was an error creating new users');
            return;
        }

        function getUsernames(users: IUserRequestData[] | IUserData[]): string[] {
            return compact(map(users, user => user.username));
        }
    };
}
