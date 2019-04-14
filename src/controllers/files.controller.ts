import { File, IFileData, IModelConstructor } from '../models';
import { AbstractController } from './abstract.controller';

export class FilesController extends AbstractController<File, IFileData> {
    public modelConstructor: IModelConstructor<File, IFileData> = File;
    protected readonly resourceType: string = 'files';
}
