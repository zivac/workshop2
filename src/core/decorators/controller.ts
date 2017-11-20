export function Controller(prefix: string) {
    return function(target: any) {
        Reflect.defineMetadata('controllerData', {
            url: prefix
        }, target);
    }
}