import * as express from 'express';
import { AbstractController } from '../controllers';
import { IModelData, Model } from '../models';

export abstract class AbstractRouter<T extends Model, D extends IModelData> {
    protected router: express.Router = express.Router();

    protected abstract controller: AbstractController<T, D>;

    public getRouter(): express.Router {
        this.router.get('', this.controller.getAll);
        this.router.get('/:id', this.controller.getById);
        this.router.delete('/:id', this.controller.removeById);
        this.router.post('', this.controller.create);
        this.router.put('/:id', this.controller.updateById);
        return this.router;
    }
}
