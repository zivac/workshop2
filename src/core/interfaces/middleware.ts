import { Request, Response, NextFunction } from "express-serve-static-core";

export interface Middleware {

    resolve(req: Request, res: Response, next: NextFunction): Promise<void>

}