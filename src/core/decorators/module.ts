export function Module(elements: {
    models: Function[],
    controllers: Function[],
    middleware: Function[],
    services: Function[]
}) {
    return function(target: any) {
        Reflect.defineMetadata('moduleElements', elements, target);
    }
}