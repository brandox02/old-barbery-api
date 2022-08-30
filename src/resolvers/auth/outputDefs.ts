import { Field, ObjectType } from "type-graphql";
import User from "../../entities/User";

@ObjectType()
export class SignInOutput {
  @Field()
  token: String;
}

@ObjectType()
export class LogInByCredentialOutput {
  @Field()
  token: String;
}

@ObjectType()
export class LogInByTokenOutput {
  @Field({ nullable: true })
  user: User;
}
