export function Controller(prefix: string, middleware?: Function[]) {
    return function(target: any) {
        Reflect.defineMetadata('controllerData', {
            url: prefix,
            middleware: middleware
        }, target);
    }
}