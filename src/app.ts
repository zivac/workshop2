import "reflect-metadata";
import { Server } from "./core";
import { AppModule } from './app/app.module';

new Server(AppModule, 3000);