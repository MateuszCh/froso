import { NextFunction, Request, Response } from 'express';
import * as fs from 'fs';
import { capitalize, each, isArray } from 'lodash';
import * as path from 'path';

import { Counter, IResourceData, IResourceRequestData, Resource } from '../resources';
import { getError, writeFile, toId } from '../utils';

export interface IOnResponse {
    status: OnResponseStatus;
    error?: any;
    response?: any;
    responseStatus?: number;
}

export enum OnResponseStatus {
    Ok,
    Error,
    Response
}

export const okOnResponse: IOnResponse = { status: OnResponseStatus.Ok };

export abstract class AbstractController<T extends IResourceData, D extends IResourceRequestData> {
    public abstract resource: Resource<T, D>;

    public counter = new Counter();

    public exportDirectory = path.join(__dirname, '..', 'exports');

    public getAll = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const modelsData: T[] = await this.resource.find();
        return res.send(modelsData);
    };

    public getById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const id = toId(req.params?.id);

        if (!id) {
            return res.status(422).send(getError('Please specify id'));
        } else {
            const modelData: T | null = await this.resource.findById(id);
            if (!modelData) {
                return res.status(404).send(getError(`There is no ${this.resource.resourceType} with ${id} id`));
            } else {
                return res.send(modelData);
            }
        }
    };

    public removeById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const id = toId(req.params?.id);

        if (!id) {
            return res.status(422).send(getError('Please specify id'));
        } else {
            const deleteResult = await this.resource.deleteById(id);

            const defaultErrorMessage = `There was an error deleting ${this.resource.resourceType} with id: ${id}`;

            if (deleteResult.ok && deleteResult.ok === 1) {
                if (deleteResult.value) {
                    const onRemoveResult = await this.onRemove(deleteResult.value);

                    const { status, error, responseStatus, response } = onRemoveResult;

                    if (status === OnResponseStatus.Error) {
                        return next(error || defaultErrorMessage);
                    } else if (status === OnResponseStatus.Response) {
                        return res.status(responseStatus || 200).send(response || deleteResult.value);
                    }
                    return res.status(200).send(deleteResult.value);
                }
                return res.status(404).send(getError(`There is no ${this.resource.resourceType} widh id: ${id}`));
            } else {
                return next(defaultErrorMessage);
            }
        }
    };

    public updateById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const id = toId(req.params?.id);

        if (!id) {
            return res.status(422).send(getError('Please specify id'));
        } else {
            const data = req.body;

            const defaultErrorMessage = `There was an error updating ${this.resource.resourceType} with id: ${id}`;

            if (isArray(data)) {
                return next(defaultErrorMessage);
            }

            const updateResult = await this.resource.updateById(id, data);

            if (updateResult.ok && updateResult.ok === 1) {
                if (updateResult.value) {
                    const onUpdateResult = await this.onUpdate(updateResult.value);

                    const { status, error, responseStatus, response } = onUpdateResult;

                    if (status === OnResponseStatus.Error) {
                        return next(error || defaultErrorMessage);
                    } else if (status === OnResponseStatus.Response) {
                        return res.status(responseStatus || 200).send(response || updateResult.value);
                    }

                    return res.status(200).send(updateResult.value);
                }
                return res.status(404).send(getError(`There is no ${this.resource.resourceType} widh id: ${id}`));
            } else {
                return next(defaultErrorMessage);
            }
        }
    };

    public create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const manyMode = isArray(req.body);

        const modelsToCreate: D[] = manyMode ? req.body : [req.body];
        const collectionName = this.resource.collectionName;
        const counter = await this.counter.findByCollectionName(collectionName);

        if (counter) {
            const counterValue = counter.counter;
            each(modelsToCreate, (modelToCreate, i) => {
                modelToCreate.id = counterValue + i;
            });
            await this.counter.incrementCounter(collectionName, modelsToCreate.length);
        }

        const createResult = await this.resource.createMany(modelsToCreate);

        const singleDefaultErrorMessage = `${capitalize(this.resource.resourceType)} was not created.`;
        const manyDefaultErrorMessage = `${capitalize(this.resource.resourceType)}s weren't created`;
        const defaultErrorMessage = manyMode ? manyDefaultErrorMessage : singleDefaultErrorMessage;

        if (createResult.result.ok && createResult.result.ok === 1) {
            const resultData: T[] = createResult.ops;
            each(resultData, resultModel => delete resultModel._id);

            const onCreateResult = await this.onCreate(resultData);

            const { status, error, responseStatus, response } = onCreateResult;

            if (status === OnResponseStatus.Error) {
                return next(error || defaultErrorMessage);
            } else if (status === OnResponseStatus.Response) {
                return res.status(responseStatus || 200).send(response || resultData);
            }

            return res.status(200).send(manyMode ? resultData : resultData[0]);
        } else {
            return next(defaultErrorMessage);
        }
    };

    public export = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const modelsData: T[] = await this.resource.find(req.body || {}, { _id: 0, id: 0 });

        const jsonModels = JSON.stringify(modelsData, null, 4);

        if (!fs.existsSync(this.exportDirectory)) {
            fs.mkdirSync(this.exportDirectory);
        }

        const writeError = await writeFile(`${this.exportDirectory}/${this.resource.collectionName}.json`, jsonModels);

        if (writeError) {
            return next(writeError);
        } else {
            return res.send(`/export/${this.resource.collectionName}`);
        }
    };

    protected async onRemove(deletedResource: T): Promise<IOnResponse> {
        return okOnResponse;
    }

    protected async onUpdate(updatedResource: T): Promise<IOnResponse> {
        return okOnResponse;
    }

    protected async onCreate(createdResource: T[]): Promise<IOnResponse> {
        return okOnResponse;
    }
}
