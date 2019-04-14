import { Component, IComponentData, IModelConstructor } from '../models';
import { AbstractController } from './abstract.controller';

export class ComponentsController extends AbstractController<Component, IComponentData> {
    public modelConstructor: IModelConstructor<Component, IComponentData> = Component;
    protected readonly resourceType: string = 'components';
}
