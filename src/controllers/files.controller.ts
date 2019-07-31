import { FrosoFile, IFileData, IFileRequestData } from '../resources';
import { removefile } from '../utils';
import { FrosoMulter } from './../config/multer';
import { AbstractController, IOnResponse, okOnResponse, OnResponseStatus } from './abstract.controller';

export class FilesController extends AbstractController<IFileData, IFileRequestData> {
    public resource = new FrosoFile();

    constructor(public multer: FrosoMulter) {
        super();
    }

    protected async onRemove(deletedResource: IFileData): Promise<IOnResponse> {
        if (deletedResource) {
            try {
                await removefile(`${this.multer.directory}/${deletedResource.filename}`);
                return okOnResponse;
            } catch (err) {
                console.log(err);
                return { status: OnResponseStatus.Error, error: err };
            }
        } else {
            return okOnResponse;
        }
    }
}
