export function Query() {
    return function(target: any, propertyKey: string, index: number) {
        let routeData = Reflect.getMetadata('paramData', target, propertyKey) || [];
        let types = Reflect.getMetadata('design:paramtypes', target, propertyKey);
        routeData[index] = {
            key: 'query',
            type: types[index]
        }
        Reflect.defineMetadata('paramData', routeData, target, propertyKey);
    }
}