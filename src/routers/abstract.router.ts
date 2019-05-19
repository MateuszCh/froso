import { Router } from 'express';

import { AbstractController } from '../controllers';
import { IModelData, Model } from '../models';

export abstract class AbstractRouter<T extends Model, D extends IModelData> {
    protected router: Router = Router();

    protected abstract controller: AbstractController<T, D>;

    public getRouter(): Router {
        const validators = this.controller.modelConstructor.validators;

        this.router.get('', this.controller.getAll);
        this.router.get('/:id', this.controller.getById);
        this.router.delete('/:id', this.controller.removeById);
        this.router.post('', validators, this.controller.create);
        this.router.put('/:id', validators, this.controller.updateById);
        return this.router;
    }
}
