export function Req() {
    return function(target: any, propertyKey: string, index: number) {
        let routeData = Reflect.getMetadata('paramData', target, propertyKey) || [];
        routeData[index] = {
            key: 'req'
        }
        Reflect.defineMetadata('paramData', routeData, target, propertyKey);
    }
}