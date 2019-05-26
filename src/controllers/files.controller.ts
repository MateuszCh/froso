import { File, IFileData } from '../resources';
import { AbstractController } from './abstract.controller';

export class FilesController extends AbstractController<IFileData> {
    public resource = new File();
}
