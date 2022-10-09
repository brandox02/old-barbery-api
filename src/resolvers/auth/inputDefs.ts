import { Field, InputType } from "type-graphql";

@InputType()
export class SignInInput {
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
  @Field()
  phoneNumber: string;
}

@InputType()
export class LogInByCredentialInput {
  @Field({ nullable: true })
  email?: string;
  @Field()
  password: string;
  @Field({ nullable: true })
  username?: string;
}
