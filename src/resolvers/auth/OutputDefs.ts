import { Field, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class LoginOutput {
  @Field()
  token: String;
}

@ObjectType()
export class SignInByCredentialOutput {
  @Field()
  token: String;
}

@InputType()
export class SignInByTokenOutput {
  @Field()
  token: string;
}
