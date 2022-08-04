import { Field, InputType } from "type-graphql";

@InputType()
export class UserInput {
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  username: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  password: string;

  @Field({ nullable: true })
  firstname: string;

  @Field({ nullable: true })
  lastname: string;

  @Field({ nullable: true })
  isAdmin: boolean;
}
