import { FilesController } from '../controllers';
import { IFileData } from '../resources';
import { AbstractRouter } from './abstract.router';

export class FilesRouter extends AbstractRouter<IFileData> {
    protected controller = new FilesController();
}

const filesRouter = new FilesRouter();

export default filesRouter.getRouter();
