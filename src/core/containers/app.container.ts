import { Application, RequestHandlerParams, Request, Response } from 'express-serve-static-core';
import { Database, HttpError, HttpMethod } from './../index';
import { Collection } from 'mongodb';
import * as bodyParser from "body-parser";
import { ModelContainer } from './model.container';
import { ServiceContainer } from './service.container';
import { MiddlewareContainer } from './middleware.container';
import { ControllerContainer } from './controller.container';

export class AppContainer {

    private app: Application
    private jsonParser: any = bodyParser.json()

    private modelContainer: ModelContainer
    private serviceContainer: ServiceContainer
    private middlewareContainer: MiddlewareContainer
    private controllerContainer: ControllerContainer

    constructor(module: Function) {
        let moduleData = Reflect.getMetadata('moduleElements', module);
        if(!moduleData) throw new Error('Missing module data');
        this.modelContainer = new ModelContainer(moduleData.models);
        this.serviceContainer = new ServiceContainer(moduleData.services);
        this.middlewareContainer = new MiddlewareContainer(moduleData.middleware, this.serviceContainer);
        this.controllerContainer = new ControllerContainer(moduleData.controllers, this.serviceContainer, this.middlewareContainer)
    }

    async bootstrap(app: Application): Promise<void> {
        this.app = app;
        this.app.use(this.jsonParser);
        await this.modelContainer.loadModels();
        this.serviceContainer.loadServices();
        this.middlewareContainer.loadMiddleware();
        this.controllerContainer.loadControllers(app);
    }

}