export function Res() {
    return function(target: any, propertyKey: string, index: number) {
        let routeData = Reflect.getMetadata('paramData', target, propertyKey) || [];
        routeData[index] = {
            key: 'res'
        }
        Reflect.defineMetadata('paramData', routeData, target, propertyKey);
    }
}