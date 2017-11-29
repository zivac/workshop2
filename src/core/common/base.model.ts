import { ObjectId } from "bson";
import { Collection, WriteOpResult, DeleteWriteOpResultObject } from "mongodb";

type ID = ObjectId | string;

export class BaseModel {

    _id: ObjectId

    constructor(init?: ID | Object) {
        if(init) {
            if(init instanceof ObjectId) this._id = init;
            else if (typeof init == 'string') this._id = new ObjectId(init);
            else Object.assign(this, init);
        }
        if(!this._id) this._id = new ObjectId();
        else if(typeof this._id == 'string') this._id = new ObjectId(this._id);
    }

    static getCollection(): Collection {
        let modelData = Reflect.getMetadata('modelData', this);
        if (!modelData) return null;
        return modelData.database.getCollection(modelData.collection);
    }

    async save(): Promise<WriteOpResult> {
        let modelData = Reflect.getMetadata('modelData', this.constructor);
        if (!modelData) return null;
        let collection = modelData.database.getCollection(modelData.collection);
        return collection.save(this);
    }

    static async find(filters?: Object): Promise<any[]> {
        let collection = this.getCollection();
        if (!collection) return null;
        if (filters && filters['_id'] && typeof filters['_id'] == 'string') filters['_id'] = new ObjectId(filters['_id']);
        return (await collection.find(filters).toArray()).map(item => new this(item));
    }

    static async update(id: ID, data: any): Promise<WriteOpResult> {
        let collection = this.getCollection();
        if (!collection) return null;
        if (!(id instanceof ObjectId)) id = new ObjectId(id);
        return await collection.update({_id: id}, {$set: data});
    }

    static async delete(id: ID): Promise<DeleteWriteOpResultObject> {
        let collection = this.getCollection();
        if (!collection) return null;
        if (!(id instanceof ObjectId)) id = new ObjectId(id);
        return await collection.deleteOne({_id: id});
    }

}