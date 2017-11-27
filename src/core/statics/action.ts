import { Request, Response } from 'express-serve-static-core';
import { HttpError } from '../classes/http.error';

export class Action {

    static createAction(controller: any, route: string, routeParams: any[] = []) {
        
        return async (req: Request, res: Response) => {

            try {

                let response = await controller[route](...routeParams.map(param => {
                    let reqBody = req.body;
                    if (!param) return null;
                    if (param.key == 'req') return req;
                    else if (param.key == 'res') return res;
                    else if (param.key == 'param') {
                        let paramValue = req.params[param.name] || req.query[param.name] || (req.body ? req.body[param.name] : undefined);
                        if (param.required && paramValue === undefined) throw new HttpError(400, `${param.name} is required`);
                        if (param.type) {
                            if (param.type == String) paramValue = paramValue.toString();
                            else if (param.type == Number) paramValue = Number.parseFloat(paramValue);
                            else if (param.type != Object && param.type != Array) paramValue = new param.type(paramValue);
                        }
                        return paramValue;
                    } else if (param.key == 'body') {
                        if (param.type) return new param.type(req.body)
                        else return req.body;
                    } else if (param.key == 'query') return req.query;
                    else return null;
                }));
                if (!res.headersSent) res.send(response);

            } catch (err) {

                if (err instanceof HttpError) {
                    res.status(err.status);
                    res.send({
                        error: err.message
                    })
                } else {
                    res.status(500);
                    res.send({
                        error: "Internal server error"
                    })
                }

            }

        }

    }

}