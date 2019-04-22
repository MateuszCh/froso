import { NextFunction, Request, Response } from 'express';

import { capitalize } from 'lodash';
import froso from '../Froso';
import { IModelConstructor, IModelData, Model } from '../models';
import { ResourceService } from '../services';

export abstract class AbstractController<T extends Model, D extends IModelData> {
    public abstract modelConstructor: IModelConstructor<T, D>;
    protected abstract readonly resourceType: string;

    public get resource(): ResourceService<D> {
        return froso.getResource<D>(this.resourceType);
    }

    public getAll = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const modelsData: D[] = await this.resource.find();
            return res.send(modelsData);
        } catch (e) {
            return next(e);
        }
    };

    public getById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const id = req.params.id;
        try {
            const modelData: D | null = await this.resource.findById(id);
            if (!modelData) {
                return res.send(`There is no ${this.modelConstructor.type} with ${id} id`);
            } else {
                return res.send(modelData);
            }
        } catch (e) {
            return next(e);
        }
    };

    public removeById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const id = req.params.id;
        try {
            const deleteResult = await this.resource.deleteById(id);

            if (deleteResult.result.ok && deleteResult.result.ok === 1) {
                return res.status(200).send(`${this.modelConstructor.type} with id: ${id} was removed successfully.)`);
            } else {
                return res.send(`There was an error deleting ${this.modelConstructor.type} with id: ${id}`);
            }
        } catch (e) {
            return next(e);
        }
    };

    public updateById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const id = req.params.id;
        const data = req.body;
        try {
            const updateResult = await this.resource.updateById(id, data);
            if (updateResult.result.ok && updateResult.result.ok === 1) {
                return res
                    .status(200)
                    .send(`${capitalize(this.modelConstructor.type)} with id: ${id} was successfully updated.`);
            } else {
                return res.send(`There was an error updating ${this.modelConstructor.type} with id: ${id}`);
            }
        } catch (e) {
            return next(e);
        }
    };

    public create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const body = req.body;
        try {
            const createResult = await this.resource.create(body);
            if (createResult.result.ok && createResult.result.ok === 1) {
                return res.status(200).send(`${capitalize(this.modelConstructor.type)} was successfully created.`);
            }
        } catch (e) {
            return next(e);
        }
    };
}
