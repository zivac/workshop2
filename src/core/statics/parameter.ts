import { Request, Response } from "../index";
import { HttpError } from "../classes/http.error";
import { ParamKey } from '../enums/param.key';

interface ParamInterface {
    key: ParamKey,
    name?: string,
    type?: any,
    required?: boolean
}

export class Parameter {

    static resolve(req: Request, res: Response, param?: ParamInterface): any {

        if (!param) return null;

        switch(param.key) {

            case ParamKey.REQ:
                return req;

            case ParamKey.RES:
                return res;

            case ParamKey.PARAM:
                let paramValue = req.params[param.name] || req.query[param.name] || (req.body ? req.body[param.name] : undefined);
                if (param.required && paramValue === undefined) throw new HttpError(400, `${param.name} is required`);
                if (param.type) {
                    if (param.type == String) paramValue = paramValue.toString();
                    else if (param.type == Number) paramValue = Number.parseFloat(paramValue);
                    else if (param.type != Object && param.type != Array) paramValue = new param.type(paramValue);
                }
                return paramValue;

            case ParamKey.BODY:
                if (param.type) return new param.type(req.body)
                else return req.body;

            case ParamKey.QUERY:
                if (param.type) return new param.type(req.query)
                else return req.query;
                
            default:
                return null;
        }

    }

}