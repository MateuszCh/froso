import { FrosoFile, IFileData, IFileRequestData } from '../resources';
import { Multer } from './../config/multer';
import { AbstractController } from './abstract.controller';

export class FilesController extends AbstractController<IFileData, IFileRequestData> {
    public resource = new FrosoFile();

    constructor(public multer: Multer) {
        super();
    }
}
