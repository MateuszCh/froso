import { NextFunction, Request, Response } from 'express';
import { capitalize } from 'lodash';

import { Counter, IResourceData, Resource } from '../resources';

export abstract class AbstractController<T extends IResourceData> {
    public abstract resource: Resource<T>;

    public counter = new Counter();

    public getAll = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const modelsData: T[] = await this.resource.find();
        return res.send(modelsData);
    };

    public getById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const id = req.params.id;
        const modelData: T | null = await this.resource.findById(id);
        if (!modelData) {
            return res.send(`There is no ${this.resource.type} with ${id} id`);
        } else {
            return res.send(modelData);
        }
    };

    public removeById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const id = req.params.id;
        const deleteResult = await this.resource.deleteById(id);

        if (deleteResult.result.ok && deleteResult.result.ok === 1) {
            return res.status(200).send(`${this.resource.type} with id: ${id} was removed successfully.)`);
        } else {
            return res.status(500).send(`There was an error deleting ${this.resource.type} with id: ${id}`);
        }
    };

    public updateById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const id = req.params.id;
        const data = req.body;
        const updateResult = await this.resource.updateById(id, data);
        if (updateResult.result.ok && updateResult.result.ok === 1) {
            return res.status(200).send(updateResult.ops[0]);
        } else {
            return res.status(500).send(`There was an error updating ${this.resource.type} with id: ${id}`);
        }
    };

    public create = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const body: T = req.body;
        const collectionName = this.resource.collectionName;
        const counter = await this.counter.findByCollectionName(collectionName);
        if (counter) {
            body.id = counter.counter;
            await this.counter.incrementCounter(collectionName);
        }
        const createResult = await this.resource.create(body);
        if (createResult.result.ok && createResult.result.ok === 1) {
            return res.status(200).send(createResult.ops[0]);
        } else {
            return res.status(500).send(`${capitalize(this.resource.type)} was not created.`);
        }
    };
}
