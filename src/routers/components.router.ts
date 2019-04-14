import { ComponentsController } from '../controllers';
import { Component, IComponentData } from '../models';
import { AbstractRouter } from './abstract.router';

export class ComponentsRouter extends AbstractRouter<Component, IComponentData> {
    protected controller = new ComponentsController();
}

const componentsRouter = new ComponentsRouter();

export default componentsRouter.getRouter();
