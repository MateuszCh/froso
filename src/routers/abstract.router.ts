import * as express from 'express';
import { AbstractController } from '../controllers';
import { IModelData, Model } from '../models';

export abstract class AbstractRouter<T extends Model, D extends IModelData> {
    protected router: express.Router = express.Router();

    protected abstract controller: AbstractController<T, D>;

    public getRouter(): express.Router {
        this.router.get('', this.controller.getModels);
        this.router.get('/:id', this.controller.getById);
        return this.router;
    }
}
