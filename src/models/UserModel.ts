import mongoose, { Schema, Types } from "mongoose";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field()
  username: string;
  @Field()
  email: string;
  @Field()
  password: string;
  @Field()
  firstname: string;
  @Field()
  lastname: string;
  @Field()
  _id?: string;
}

const UserModel = mongoose.model<User>(
  "users",
  new Schema<User>({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
  })
);

export default UserModel;
