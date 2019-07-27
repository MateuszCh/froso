import { RequestHandler, Router } from 'express';

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

    public get getHandlers(): RequestHandler[] {
        return [asyncMiddleware(this.controller.getAll)];
    }

    public get getByIdHandlers(): RequestHandler[] {
        return [toIdSanitizer, asyncMiddleware(this.controller.getById)];
    }

    public get deleteByIdHandlers(): RequestHandler[] {
        return [toIdSanitizer, asyncMiddleware(this.controller.removeById)];
    }

    public get postHandlers(): RequestHandler[] {
        return [
            allowedFieldsMiddlewareFactory<D>(this.controller.resource.allowedFields),
            formatBeforeSaveMiddlewareFactory(this.controller.resource),
            ...this.controller.resource.createValidators,
            validationMiddleware,
            asyncMiddleware(this.controller.create)
        ];
    }

    public get putHandlers(): RequestHandler[] {
        return [
            toIdSanitizer,
            allowedFieldsMiddlewareFactory<D>(this.controller.resource.allowedFields),
            formatBeforeSaveMiddlewareFactory<T, D>(this.controller.resource),
            ...this.controller.resource.updateValidators,
            validationMiddleware,
            asyncMiddleware(this.controller.updateById)
        ];
    }

    public getRouter(): Router {
        this.router.get('', ...this.getHandlers);
        this.router.get('/:id', ...this.getByIdHandlers);
        this.router.post('', ...this.postHandlers);
        this.router.post('/export', asyncMiddleware(this.controller.export));
        this.router.delete('/:id', ...this.deleteByIdHandlers);
        this.router.put('/:id', ...this.putHandlers);
        return this.router;
    }
}
