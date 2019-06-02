import { NextFunction, Request, Response } from 'express';
import { capitalize } from 'lodash';

import { Counter, IResourceData, IResourceRequestData, Resource } from '../resources';

export abstract class AbstractController<T extends IResourceData, D extends IResourceRequestData> {
    public abstract resource: Resource<T, D>;

    public counter = new Counter();

    public getAll = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const modelsData: T[] = await this.resource.find();
        return res.send(modelsData);
    };

    public getById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const id = parseInt(req.params.id, 10);
        const modelData: T | null = await this.resource.findById(id);
        if (!modelData) {
            return res.send(`There is no ${this.resource.type} with ${id} id`);
        } else {
            return res.send(modelData);
        }
    };

    public removeById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const id = parseInt(req.params.id, 10);
        const deleteResult = await this.resource.deleteById(id);

        if (deleteResult.ok && deleteResult.ok === 1) {
            if (deleteResult.value) {
                return res.status(200).send(deleteResult.value);
            }
            return res.status(404).send(`There is no ${this.resource.type} widh id: ${id}`);
        } else {
            return res.status(500).send(`There was an error deleting ${this.resource.type} with id: ${id}`);
        }
    };

    public updateById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const id = parseInt(req.params.id, 10);
        const data = req.body;
        const updateResult = await this.resource.updateById(id, data);
        if (updateResult.ok && updateResult.ok === 1) {
            if (updateResult.value) {
                return res.status(200).send(updateResult.value);
            }
            return res.status(404).send(`There is no ${this.resource.type} widh id: ${id}`);
        } else {
            return res.status(500).send(`There was an error updating ${this.resource.type} with id: ${id}`);
        }
    };

    public create = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const data: D = req.body;
        const collectionName = this.resource.collectionName;
        const counter = await this.counter.findByCollectionName(collectionName);

        if (counter) {
            data.id = counter.counter;
            await this.counter.incrementCounter(collectionName);
        }
        const createResult = await this.resource.create(data);
        if (createResult.result.ok && createResult.result.ok === 1) {
            return res.status(200).send(createResult.ops[0]);
        } else {
            return res.status(500).send(`${capitalize(this.resource.type)} was not created.`);
        }
    };
}