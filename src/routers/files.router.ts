import { RequestHandler } from 'express';

import { FilesController } from '../controllers';
import { IFileData, IFileRequestData } from '../resources';
import {
    allowedFieldsFilesMiddlewareFactory,
    asyncMiddleware,
    formatFilesBeforeSaveMiddlewareFactory,
    validationMiddleware,
    allowedFieldsMiddlewareFactory
} from '../utils';
import { FrosoMulter } from './../config';
import { AbstractRouter } from './abstract.router';

export class FilesRouter extends AbstractRouter<IFileData, IFileRequestData> {
    protected controller: FilesController;

    constructor(public multer: FrosoMulter) {
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

    public get importHandlers(): RequestHandler[] {
        return [
            allowedFieldsMiddlewareFactory<IFileRequestData>(this.controller.resource.allowedFields),
            ...this.controller.resource.createValidators,
            validationMiddleware,
            asyncMiddleware(this.controller.create)
        ];
    }
}
