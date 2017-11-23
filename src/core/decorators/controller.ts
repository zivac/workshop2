import { Middleware } from "../index";

export function Controller(prefix: string, middleware?: Middleware[]) {
    return function(target: any) {
        Reflect.defineMetadata('controllerData', {
            url: prefix,
            middleware: middleware
        }, target);
    }
}