import { HttpMethod } from "../../enums/http.method";

export function Put(route: string, middleware?: Function[]) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let routes = Reflect.getMetadata('routes', target) || [];
        routes.push({
            function: propertyKey,
            url: route,
            type: HttpMethod.PUT,
            middleware: middleware
        })
        Reflect.defineMetadata('routes', routes, target);
    }
}