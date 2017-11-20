import { ObjectID } from "bson";
import { Collection, Db, WriteOpResult } from "mongodb";

export class BaseModel {

    _id: ObjectID

    constructor(init?: Object) {
        if(init) Object.assign(this, init);
        if(!this._id) this._id = new ObjectID();
    }

    static getCollection(): Collection {
        let modelData = Reflect.getMetadata('modelData', this);
        if(!modelData) return null;
        return modelData.database.db.collection(modelData.collection);
    }

    async save(): Promise<WriteOpResult> {
        let collection = BaseModel.getCollection();
        if(!collection) return null;
        return collection.save(this);
    }

}