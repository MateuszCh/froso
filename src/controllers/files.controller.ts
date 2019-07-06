import { NextFunction, Request, Response } from 'express';
import { each, values } from 'lodash';

import { FrosoFile, IFileData, IFileRequestData, IFilesUploadData } from '../resources';
import { removefile } from '../utils';
import { Multer } from './../config/multer';
import { AbstractController, IOnResponse, okOnResponse, OnResponseStatus } from './abstract.controller';

export class FilesController extends AbstractController<IFileData, IFileRequestData> {
    public resource = new FrosoFile();

    constructor(public multer: Multer) {
        super();
    }

    public create = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const body: IFilesUploadData = req.body;
        const filesDataArray = values(body.filesData);
        const collectionName = this.resource.collectionName;
        const counter = await this.counter.findByCollectionName(collectionName);

        if (counter) {
            const counterValue = counter.counter;
            each(filesDataArray, (modelData, i) => {
                modelData.id = counterValue + i;
            });
            await this.counter.incrementCounter(collectionName, filesDataArray.length);
        }

        const createResult = await this.resource.createMany(filesDataArray);

        const defaultErrorMessage = 'Files was not created';

        if (createResult.result.ok && createResult.result.ok === 1) {
            const resultData: IFileData[] = createResult.ops;
            each(resultData, fileModel => delete fileModel._id);

            const onCreateResult = await this.onCreate(resultData);

            const { status, error, responseStatus, response } = onCreateResult;

            if (status === OnResponseStatus.Error) {
                return next(error || defaultErrorMessage);
            } else if (status === OnResponseStatus.Response) {
                return res.status(responseStatus || 200).send(response || resultData);
            }

            return res.status(200).send(resultData);
        } else {
            return next(defaultErrorMessage);
        }
    };

    protected async onRemove(deletedResource: IFileData): Promise<IOnResponse> {
        if (deletedResource) {
            try {
                await removefile(`${this.multer.directory}/${deletedResource.filename}`);
                return okOnResponse;
            } catch (err) {
                console.log(err);
                return { status: OnResponseStatus.Error, error: err };
            }
        } else {
            return okOnResponse;
        }
    }
}
