import { Field, InputType } from "type-graphql";

@InputType()
export class LoginInput {
  @Field()
  email: string;
  @Field()
  firstname: string;
  @Field()
  lastname: string;
  @Field()
  password: string;
  @Field()
  username: string;
}

@InputType()
export class SignInByCredentialInput {
  @Field({ nullable: true })
  email?: string;
  @Field()
  password: string;
  @Field({ nullable: true })
  username?: string;
}

@InputType()
export class SignInByTokenInput {
  @Field()
  token: string;
}
