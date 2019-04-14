import { NextFunction, Request, Response } from 'express';
import { map } from 'lodash';
import { ObjectID } from 'mongodb';

import froso from '../Froso';
import { IModelConstructor, IModelData, Model } from '../models';
import { ResourceService } from '../services';

export abstract class AbstractController<T extends Model, D extends IModelData> {
    public abstract modelConstructor: IModelConstructor<T, D>;
    protected abstract readonly resourceType: string;

    public get resource(): ResourceService<D> {
        return froso.getResource<D>(this.resourceType);
    }

    public getModels = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const modelsData: D[] = await this.resource.find();
        const pages = map(modelsData, (data: D) => new this.modelConstructor(data));
        return res.send(pages);
    };

    public getById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const id = new ObjectID(req.params.id);
        const modelData: D | null = await this.resource.findById(id);
        if (!modelData) {
            return res.send(`There is no ${this.modelConstructor.type} with ${id} id`);
        } else {
            return res.send(new this.modelConstructor(modelData));
        }
    };
}
