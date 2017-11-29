import { Database } from '../classes/database';

export class ModelContainer {

    models: any[]

    constructor(models: any[]) {
        this.models = models;
    }

    async loadModels(): Promise<void> {
        let modelData = this.models.map(model => Reflect.getMetadata('modelData', model)).filter(data => data);
        let databases = <Database[]>Array.from(new Set(modelData.map(data => data.database)));
        await Promise.all(
            databases.map(async (db) => {
                await db.connect();
                let collections = Array.from(new Set(modelData.filter(data => data.database == db).map(data => data.collection)));
                await Promise.all(collections.map(async (collection) => await db.createCollection(collection)));
            })
        );
    }

}