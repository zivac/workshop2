import { Request, Response } from 'express-serve-static-core';
import { HttpError } from '../classes/http.error';
import { Parameter } from './parameter';

export class Action {

    static createAction(controller: any, route: string, routeParams: any[] = []) {
        
        return async (req: Request, res: Response) => {

            try {

                let response = await controller[route](...routeParams.map(param => Parameter.resolve(req, res, param)));
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