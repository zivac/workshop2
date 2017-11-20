import * as express from 'express';
import { Request, Response, Application, NextFunction } from 'express-serve-static-core';
import { HttpError } from './classes/http.error';

export class Server {

    port: number;
    app: Application;

    constructor(module: Function, port?: number) {

        this.port = port || 3000;
        this.app = express();

        //add some routes here
        let moduleElements = Reflect.getMetadata('moduleElements', module);

        this.app.use(this.notFound); //404 error handler
        this.app.use(this.errorHandler); //other errors handler

        this.app.listen(this.port, () => {
            console.log('App listening on port ' + this.port);
        })

    }

    private notFound(req: Request, res: Response, next: NextFunction): void {
        res.status(404);
        res.send({
            error: 'Not found'
        })
    }

    private errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
        if(err instanceof HttpError) {
            res.status(err.status);
            res.send({
                error: err.message
            })
        } else {
            res.status(500);
            res.send({
                error: 'Internal server error'
            })
        }
    }

}