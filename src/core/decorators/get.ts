import { HttpMethod } from "../enums/http.method";
import { Middleware } from '../interfaces/middleware';

export function Get(route: string, middleware?: Middleware[]) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata('route_data', {
            url: route,
            type: HttpMethod.GET,
            middleware: middleware
        }, descriptor.value)
        return descriptor;
    }
}