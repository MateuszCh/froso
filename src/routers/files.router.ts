import { RequestHandler } from 'express';

import { FilesController } from '../controllers';
import { IFileData, IFileRequestData } from '../resources';
import {
    allowedFieldsFilesMiddlewareFactory,
    asyncMiddleware,
    formatFilesBeforeSaveMiddlewareFactory,
    validationMiddleware
} from '../utils';
import { Multer } from './../config';
import { AbstractRouter } from './abstract.router';

export class FilesRouter extends AbstractRouter<IFileData, IFileRequestData> {
    protected controller: FilesController;

    constructor(public multer: Multer) {
        super();
        this.controller = new FilesController(this.multer);
    }

    public get postHandlers(): RequestHandler[] {
        return [
            this.controller.multer.setFilenames,
            this.multer.upload().array('files'),
            allowedFieldsFilesMiddlewareFactory(this.controller.resource.allowedFields),
            formatFilesBeforeSaveMiddlewareFactory(this.controller.resource),
            ...this.controller.resource.createValidators,
            validationMiddleware,
            asyncMiddleware(this.controller.create)
        ];
    }
}
