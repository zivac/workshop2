import { Model, BaseModel } from "../../core";
import { myDb } from "../../config/connections";

@Model(myDb, 'user')
export class User extends BaseModel {

}