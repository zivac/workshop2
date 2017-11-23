import { ObjectId } from "bson";
import { Collection, WriteOpResult, DeleteWriteOpResultObject } from "mongodb";

export class BaseModel {

    _id: ObjectId

    constructor(init?: Object) {
        if(init) Object.assign(this, init);
        if(!this._id) this._id = new ObjectId();
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

    static async update(id: string | ObjectId, data: any): Promise<WriteOpResult> {
        let collection = this.getCollection();
        if (!collection) return null;
        if (!(id instanceof ObjectId)) id = new ObjectId(id);
        return await collection.update({_id: id}, {$set: data});
    }

    static async delete(id: string | ObjectId): Promise<DeleteWriteOpResultObject> {
        let collection = this.getCollection();
        if (!collection) return null;
        if (!(id instanceof ObjectId)) id = new ObjectId(id);
        return await collection.deleteOne({_id: id});
    }

}