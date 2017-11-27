export function Param(name: string, required: boolean = false) {
    return function(target: any, propertyKey: string, index: number) {
        let routeData = Reflect.getMetadata('paramData', target, propertyKey) || [];
        let types = Reflect.getMetadata('design:paramtypes', target, propertyKey);
        routeData[index] = {
            key: 'param',
            name: name,
            required: required,
            type: types[index]
        }
        Reflect.defineMetadata('paramData', routeData, target, propertyKey);
    }
}