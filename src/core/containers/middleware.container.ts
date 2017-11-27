import { ServiceContainer } from './service.container';

export class MiddlewareContainer {

    private serviceContainer: ServiceContainer

    middleware: any[]

    constructor(middleware: any[], serviceContainer: ServiceContainer) {
        this.middleware = middleware;
        this.serviceContainer = serviceContainer;
    }

    loadMiddleware(): void {
        this.middleware = this.middleware.map(Middleware => {
            let dependencies = Reflect.getMetadata('design:paramtypes', Middleware) || [];
            return new Middleware(...dependencies.map(dependency => this.serviceContainer.services.find(service => service instanceof dependency)));
        })
    }

}