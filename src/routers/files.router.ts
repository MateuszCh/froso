import { FilesController } from '../controllers';
import { File, IFileData } from '../models';
import { AbstractRouter } from './abstract.router';

export class FilesRouter extends AbstractRouter<File, IFileData> {
    protected controller = new FilesController();
}

const filesRouter = new FilesRouter();

export default filesRouter.getRouter();
