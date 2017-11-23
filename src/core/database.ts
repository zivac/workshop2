import { MongoClient, Db, Collection } from "mongodb";

export class Database {

    private _url: string;
    private _db: Db;
    private _isConnected: boolean = false;

    constructor(name: string, host: string = 'localhost', port: number = 27017) {
        this._url = `mongodb://${host}:${port}/${name}`
    }

    async connect(): Promise<Db> {
        if(!this._isConnected) {
            this._db = await MongoClient.connect(this._url)
            this._isConnected = true;
        }
        return this._db;
    }

    async close(): Promise<void> {
        let closing = await this._db.close();
        this._isConnected = false;
        return closing;
    }

    async createCollection(collection: string): Promise<Collection> {
        return await this._db.createCollection(collection)
    }

    getCollection(collection: string): Collection {
        return this._db.collection(collection);
    }

}