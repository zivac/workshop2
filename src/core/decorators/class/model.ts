import { Database } from "../../database";

export function Model(database: Database, collection: string) {
    return function (target: any) {
        Reflect.defineMetadata('modelData', {
            database: database,
            collection: collection
        }, target);
    }
}