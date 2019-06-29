import { FilesController } from '../controllers';
import { IFileData, IFileRequestData } from '../resources';
import { Multer } from './../config/multer';
import { AbstractRouter } from './abstract.router';

export class FilesRouter extends AbstractRouter<IFileData, IFileRequestData> {
    protected controller: FilesController;

    constructor(public multer: Multer) {
        super();
        this.controller = new FilesController(this.multer);
    }
}
