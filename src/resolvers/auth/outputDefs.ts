import { Field, ObjectType } from "type-graphql";

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
