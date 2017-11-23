import * as express from 'express';
import { Request, Response, Application, NextFunction } from 'express-serve-static-core';
import { HttpError } from './classes/http.error';
import { AppContainer } from './app.container';

export class Server {

    private _port: number;
    private _app: Application;
    private _module: Function

    constructor(module: Function, port?: number) {

        this._port = port || 3000;
        this._module = module;

        this.start();

    }

    private async start() {
        this._app = express();
        
        //add some routes here
        await new AppContainer(this._module).bootstrap(this._app)

        this._app.use(this.notFound); //404 error handler

        this._app.listen(this._port, () => {
            console.log('App listening on port ' + this._port);
        })
}

    private notFound(req: Request, res: Response, next: NextFunction): void {
        res.status(404);
        res.send({
            error: 'Not found'
        })
    }

}