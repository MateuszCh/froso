import { FilesController } from '../controllers';
import { IFileData, IFileRequestData } from '../resources';
import { AbstractRouter } from './abstract.router';

export class FilesRouter extends AbstractRouter<IFileData, IFileRequestData> {
    protected controller = new FilesController();
}

const filesRouter = new FilesRouter();

export default filesRouter.getRouter();
