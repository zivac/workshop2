import { ObjectId } from "bson";
import { Collection, WriteOpResult } from "mongodb";

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
        let collection = BaseModel.getCollection();
        if (!collection) return null;
        return collection.save(this);
    }

    static async find(filters?: Object): Promise<any[]> {
        let collection = BaseModel.getCollection();
        if (!collection) return null;
        if (filters && filters['_id'] && typeof filters['_id'] == 'string') filters['_id'] = new ObjectId(filters['_id']);
        return (await collection.find(filters).toArray()).map(item => new this(item));
    }

}