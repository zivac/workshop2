import { Module } from "../core";
import { UserController } from './controllers/user.controller';

@Module({
    controllers: [
        UserController
    ],
    services: []
})
export class AppModule {

}