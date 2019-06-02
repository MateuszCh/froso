import { FrosoFile, IFileData, IFileRequestData } from '../resources';
import { AbstractController } from './abstract.controller';

export class FilesController extends AbstractController<IFileData, IFileRequestData> {
    public resource = new FrosoFile();
}
