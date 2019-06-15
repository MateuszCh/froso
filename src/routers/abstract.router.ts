import { Router } from 'express';

import { AbstractController } from '../controllers';
import { IResourceData, IResourceRequestData } from '../resources';
import {
    allowedFieldsMiddlewareFactory,
    asyncMiddleware,
    formatBeforeSaveMiddlewareFactory,
    toIdSanitizer,
    validationMiddleware
} from '../utils';

export abstract class AbstractRouter<T extends IResourceData, D extends IResourceRequestData> {
    protected router: Router = Router();

    protected abstract controller: AbstractController<T, D>;

    public getRouter(): Router {
        this.router.get('', asyncMiddleware(this.controller.getAll));
        this.router.get('/:id', toIdSanitizer, asyncMiddleware(this.controller.getById));
        this.router.delete('/:id', toIdSanitizer, asyncMiddleware(this.controller.removeById));
        this.router.post(
            '',
            allowedFieldsMiddlewareFactory(this.controller.resource.allowedFields),
            formatBeforeSaveMiddlewareFactory(this.controller.resource),
            this.controller.resource.createValidators,
            validationMiddleware,
            asyncMiddleware(this.controller.create)
        );
        this.router.put(
            '/:id',
            toIdSanitizer,
            allowedFieldsMiddlewareFactory(this.controller.resource.allowedFields),
            formatBeforeSaveMiddlewareFactory(this.controller.resource),
            this.controller.resource.updateValidators,
            validationMiddleware,
            asyncMiddleware(this.controller.updateById)
        );
        return this.router;
    }
}
