import { NextFunction, Request, Response } from 'express';
import { capitalize } from 'lodash';

import { Counter, IResourceData, IResourceRequestData, Resource } from '../resources';
import { getError } from '../utils';

export abstract class AbstractController<T extends IResourceData, D extends IResourceRequestData> {
    public abstract resource: Resource<T, D>;

    public counter = new Counter();

    public getAll = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const modelsData: T[] = await this.resource.find();
        return res.send(modelsData);
    };

    public getById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const id: number = req.params.id;
        const modelData: T | null = await this.resource.findById(id);
        if (!modelData) {
            return res.status(404).send(getError(`There is no ${this.resource.resourceType} with ${id} id`));
        } else {
            return res.send(modelData);
        }
    };

    public removeById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const id: number = req.params.id;
        const deleteResult = await this.resource.deleteById(id);

        if (deleteResult.ok && deleteResult.ok === 1) {
            if (deleteResult.value) {
                await this.onRemove(deleteResult.value);
                return res.status(200).send(deleteResult.value);
            }
            return res.status(404).send(getError(`There is no ${this.resource.resourceType} widh id: ${id}`));
        } else {
            return next(`There was an error deleting ${this.resource.resourceType} with id: ${id}`);
        }
    };

    public updateById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const id: number = req.params.id;
        const data = req.body;
        const updateResult = await this.resource.updateById(id, data);
        if (updateResult.ok && updateResult.ok === 1) {
            if (updateResult.value) {
                await this.onUpdate(updateResult.value);
                return res.status(200).send(updateResult.value);
            }
            return res.status(404).send(getError(`There is no ${this.resource.resourceType} widh id: ${id}`));
        } else {
            return next(`There was an error updating ${this.resource.resourceType} with id: ${id}`);
        }
    };

    public create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const data: D = req.body;
        const collectionName = this.resource.collectionName;
        const counter = await this.counter.findByCollectionName(collectionName);

        if (counter) {
            data.id = counter.counter;
            await this.counter.incrementCounter(collectionName);
        }
        const createResult = await this.resource.create(data);
        if (createResult.result.ok && createResult.result.ok === 1) {
            const resultData = createResult.ops[0];
            delete resultData._id;
            await this.onCreate(resultData);
            return res.status(200).send(resultData);
        } else {
            return next(`${capitalize(this.resource.resourceType)} was not created.`);
        }
    };

    protected onRemove = async (deletedResource: T): Promise<any> => {
        return true;
    };

    protected onUpdate = async (updatedResource: T): Promise<any> => {
        return true;
    };

    protected onCreate = async (createdResource: T): Promise<any> => {
        return true;
    };
}
