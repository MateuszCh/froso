import { IPostTypeData, IPostTypeRequestData, PostType } from '../resources';
import { AbstractController } from './abstract.controller';

export class PostTypesController extends AbstractController<IPostTypeData, IPostTypeRequestData> {
    public resource = new PostType();
}
