import { Application } from 'express-serve-static-core';
import { Database } from './index';
import { Collection } from 'mongodb';

export class Container {

    moduleData: {
        models: Function[]
        controllers: Function[]
        middleware: Function[]
        services: Function[]
    }

    controllers: Function[]
    services: Function[]

    constructor(module: Function) {
        this.moduleData = Reflect.getMetadata('moduleData', module);
        if(!this.moduleData) throw new Error('Missing module data');
    }

    async bootstrap(app: Application): Promise<void> {
       await this.loadModels();
    }

    private async loadModels(): Promise<void> {
        let modelData = this.moduleData.models.map(model => Reflect.getMetadata('modelData', model)).filter(data => data);
        let databases = <Database[]> Array.from(new Set(modelData.map(data => data.database)));
        await Promise.all(
            databases.map(async (db) => {
                await db.connect();
                let collections = Array.from(new Set(modelData.filter(data => data.database == db).map(data => data.collection)));
                await Promise.all(collections.map(async (collection) => await db.createCollection(collection)));
            })
        );
    }

    private loadServices(): void {

    }

    private loadMiddleware(): void {
        
    }

    private loadControllers(): void {

    }

}