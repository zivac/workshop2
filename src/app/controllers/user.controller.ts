import { Request, Response } from "express-serve-static-core";
import { Controller, Get } from "../../core";

@Controller('/user')
export class UserController {

    @Get('/')
    async listUsers(req: Request, res: Response) {
        res.send([
            {
                username: 'pero',
                email: 'pero.peric@gmail.com'
            }
        ]);
    }

}