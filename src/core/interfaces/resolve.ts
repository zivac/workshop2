import { Request, Response, NextFunction } from "express-serve-static-core";

export interface Resolve {

    resolve(req: Request, res: Response, next: NextFunction): Promise<void>

}