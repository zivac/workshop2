import { Application, RequestHandlerParams, Request, Response } from 'express-serve-static-core';
import { Database, HttpError } from './index';
import { Collection } from 'mongodb';
import { HttpMethod } from './enums/http.method';
import * as bodyParser from "body-parser";

export class AppContainer {

    app: Application
    jsonParser: any = bodyParser.json()

    moduleData: {
        models: any[]
        controllers: any[]
        middleware: any[]
        services: any[]
    }

    controllers: any[] = []
    services: any[] = []
    middleware: any[] = []

    constructor(module: Function) {
        this.moduleData = Reflect.getMetadata('moduleElements', module);
        if(!this.moduleData) throw new Error('Missing module data');
    }

    async bootstrap(app: Application): Promise<void> {
        this.app = app;
        this.app.use(this.jsonParser);
        await this.loadModels();
        this.loadServices();
        this.loadMiddleware();
        this.loadControllers();
    }

    private async loadModels(): Promise<void> {
        let modelData = this.moduleData.models.map(model => Reflect.getMetadata('modelData', model)).filter(data => data);
        let databases = <Database[]> Array.from(new Set(modelData.map(data => data.database)));
        await Promise.all(
            databases.map(async (db) => {
                await db.connect();
                let collections = Array.from(new Set(modelData.filter(data => data.database == db).map(data => data.collection)));
                await Promise.all(collections.map(async (collection) => await db.createCollection(collection)));
            })
        );
    }

    private loadServices(): void {
        this.moduleData.services.forEach(service => this.loadService(service));
    }

    private loadService(Service: any): Object {
        if (!Service) return null;
        let serviceSingleton = this.services.find(item => item instanceof Service);
        if (serviceSingleton) return serviceSingleton;
        let dependencies = Reflect.getMetadata('design:paramtypes', Service) || [];
        serviceSingleton = new Service(...dependencies.map(dependency => this.loadService(dependency)));
        this.services.push(serviceSingleton);
        return serviceSingleton;
    }

    private loadMiddleware(): void {
        this.middleware = this.moduleData.middleware.map(Middleware => {
            let dependencies = Reflect.getMetadata('design:paramtypes', Middleware) || [];
            return new Middleware(...dependencies.map(dependency => this.services.find(service => service instanceof dependency)));
        })
    }

    private loadControllers(): void {
        this.controllers = this.moduleData.controllers.map(Controller => {
            let controllerData = Reflect.getMetadata('controllerData', Controller);
            let dependencies = Reflect.getMetadata('design:paramtypes', Controller) || [];
            let controller = new Controller(...dependencies.map(dependency => this.services.find(service => service instanceof dependency)));
            let controllerRoutes = Reflect.getMetadata('routes', controller) || [];
            controllerRoutes.forEach(route => this.loadRoute(controller, controllerData, route))
            return controller;
        })
    }

    private loadRoute(
        controller: any, 
        controllerData: { url: string, middleware: Function[] }, 
        routeData: {function: string, url: string, type: HttpMethod, middleware: any[]}
    ) {
        let middleware = routeData.middleware || controllerData.middleware || [];
        let routeUrl = controllerData.url + routeData.url;
        let routeMiddleware = middleware.map(middleware => this.middleware.find(instance => instance instanceof middleware)).filter(item => item).map(item => item.resolve);
        let routeParams = Reflect.getMetadata('paramData', controller, routeData.function);
        this.app[routeData.type](controllerData.url + routeData.url, routeMiddleware, this.action(controller, routeData.function, routeParams));
    }

    private action(controller: any, route: string, routeParams: any[] = []) {
        return async (req: Request, res: Response) => {
            try {
                let response = await controller[route](...routeParams.map(param => {
                    let reqBody = req.body;
                    if(!param) return null;
                    if(param.key == 'req') return req;
                    else if(param.key == 'res') return res;
                    else if(param.key == 'param') {
                        let paramValue = req.params[param.name] || req.query[param.name] || (req.body ? req.body[param.name] : undefined);
                        if(param.required && paramValue === undefined) throw new HttpError(400, `${param.name} is required`);
                        if(param.type) {
                            if (param.type == String) paramValue = paramValue.toString();
                            else if (param.type == Number) paramValue = Number.parseFloat(paramValue);
                            else if (param.type != Object && param.type != Array) paramValue = new param.type(paramValue);
                        }
                        return paramValue;
                    } else if(param.key == 'body') {
                        if(param.type) return new param.type(req.body)
                        else return req.body;
                    } else if(param.key == 'query') return req.query;
                    else return null;
                }));
                if(!res.headersSent) res.send(response);
            } catch(err) {
                if(err instanceof HttpError) {
                    res.status(err.status);
                    res.send({
                        error: err.message
                    })
                } else {
                    res.status(500);
                    res.send({
                        error: err.message
                    })
                }
            }
        }
    }

}