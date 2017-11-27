import { ServiceContainer } from "./service.container";
import { MiddlewareContainer } from './middleware.container';
import { Application } from 'express-serve-static-core';
import { HttpMethod } from '../enums/http.method';
import { Action } from '../statics/action';

export class ControllerContainer {

    private serviceContainer: ServiceContainer
    private middlewareContainer: MiddlewareContainer

    private app: Application

    controllers: any[]

    constructor(controllers: any[], serviceContainer: ServiceContainer, middlewareContainer: MiddlewareContainer) {
        this.controllers = controllers;
        this.serviceContainer = serviceContainer;
        this.middlewareContainer = middlewareContainer;
    }

    loadControllers(app: Application): void {
        this.app = app;
        this.controllers = this.controllers.map(Controller => {
            let controllerData = Reflect.getMetadata('controllerData', Controller);
            let dependencies = Reflect.getMetadata('design:paramtypes', Controller) || [];
            let controller = new Controller(...dependencies.map(dependency => this.serviceContainer.services.find(service => service instanceof dependency)));
            let controllerRoutes = Reflect.getMetadata('routes', controller) || [];
            controllerRoutes.forEach(route => this.loadRoute(controller, controllerData, route))
            return controller;
        })
    }

    private loadRoute(
        controller: any,
        controllerData: { url: string, middleware: Function[] },
        routeData: { function: string, url: string, type: HttpMethod, middleware: any[] }
    ) {
        let middleware = routeData.middleware || controllerData.middleware || [];
        let routeUrl = controllerData.url + routeData.url;
        let routeMiddleware = middleware.map(middleware => this.middlewareContainer.middleware.find(instance => instance instanceof middleware)).filter(item => item).map(item => item.resolve);
        let routeParams = Reflect.getMetadata('paramData', controller, routeData.function);
        this.app[routeData.type](controllerData.url + routeData.url, routeMiddleware, Action.createAction(controller, routeData.function, routeParams));
    }

}