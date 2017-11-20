import { HttpMethod } from "../enums/http.method";

export function Post(route: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata('route_data', {
            url: route,
            type: HttpMethod.POST
        }, descriptor.value)
        return descriptor;
    }
}