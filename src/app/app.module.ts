import { Module } from "../core";
import { UserController } from './controllers/user.controller';
import { User } from "./models/user";

@Module({
    models: [
        User
    ],
    controllers: [
        UserController
    ],
    middleware: [],
    services: []
})
export class AppModule {

}