import { HttpMethod } from "../enums/http.method";

export function Get(route: string) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata('route_data', {
            url: route,
            type: HttpMethod.GET
        }, descriptor.value)
        return descriptor;
    }
}