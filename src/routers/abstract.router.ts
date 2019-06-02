import { Router } from 'express';

import { AbstractController } from '../controllers';
import { IResourceData, IResourceRequestData } from '../resources';
import { asyncMiddleware } from '../utils';

export abstract class AbstractRouter<T extends IResourceData, D extends IResourceRequestData> {
    protected router: Router = Router();

    protected abstract controller: AbstractController<T, D>;

    public getRouter(): Router {
        const validators = this.controller.resource.validators;

        this.router.get('', asyncMiddleware(this.controller.getAll));
        this.router.get('/:id', asyncMiddleware(this.controller.getById));
        this.router.delete('/:id', asyncMiddleware(this.controller.removeById));
        this.router.post('', validators, asyncMiddleware(this.controller.create));
        this.router.patch('/:id', validators, asyncMiddleware(this.controller.updateById));
        return this.router;
    }
}
