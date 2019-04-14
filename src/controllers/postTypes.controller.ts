import { IModelConstructor, IPostTypeData, PostType } from '../models';
import { AbstractController } from './abstract.controller';

export class PostTypesController extends AbstractController<PostType, IPostTypeData> {
    public modelConstructor: IModelConstructor<PostType, IPostTypeData> = PostType;
    protected readonly resourceType: string = 'post_types';
}
