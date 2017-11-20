import { MongoClient, Db, Collection } from "mongodb";

export class Database {

    url: string;
    db: Db

    constructor(name: string, host: string = 'localhost', port: number = 27017) {
        this.url = `mongodb://${host}:${port}/${name}`
    }

    async connect(): Promise<Db> {
        this.db = await MongoClient.connect(this.url)
        return this.db;
    }

    async close(): Promise<void> {
        return this.db.close();
    }

    async createCollection(collection: string): Promise<Collection> {
        return await this.db.createCollection(collection)
    }

}