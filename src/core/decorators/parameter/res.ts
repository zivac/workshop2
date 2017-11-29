import { ParamKey } from "../../enums/param.key";

export function Res() {
    return function(target: any, propertyKey: string, index: number) {
        let routeData = Reflect.getMetadata('paramData', target, propertyKey) || [];
        routeData[index] = {
            key: ParamKey.RES
        }
        Reflect.defineMetadata('paramData', routeData, target, propertyKey);
    }
}