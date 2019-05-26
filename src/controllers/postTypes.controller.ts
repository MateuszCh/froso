import { IPostTypeData, PostType } from '../resources';
import { AbstractController } from './abstract.controller';

export class PostTypesController extends AbstractController<IPostTypeData> {
    public resource = new PostType();
}
