import * as bcryptjs from 'bcryptjs';
import { Application } from 'express';
import * as passport from 'passport';
import * as passportLocal from 'passport-local';

import { IUserData, IUserRequestData, User } from './../resources';

export interface IFrosoPassportConfig {
    sessionSecret: string;
    sessionName?: string;
    users: IUserRequestData[];
}

export class FrosoPassport {
    public userResource = new User();

    public init(app: Application) {
        app.use(passport.initialize());
        app.use(passport.session());

        passport.serializeUser((user: IUserData, done) => {
            done(null, user.id);
        });

        passport.deserializeUser(async (id: number, done) => {
            try {
                const user = await this.userResource.findById(id);
                done(null, user || undefined);
            } catch (err) {
                done(err);
            }
        });

        passport.use(
            new passportLocal.Strategy(async (username: string, password: string, done) => {
                try {
                    const user = await this.userResource.findOne({ username });

                    if (!user) {
                        return done(null, false, { message: 'Incorrect username' });
                    }

                    const compareResult = await bcryptjs.compare(password, user.password);

                    if (compareResult) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Incorrect password' });
                    }
                } catch (err) {
                    done(err);
                }
            })
        );
    }
}

export const frosoPassport = new FrosoPassport();
