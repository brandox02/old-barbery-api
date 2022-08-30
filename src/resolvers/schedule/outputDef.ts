import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class SchedulesPerDay {
  @Field()
  start: string;

  @Field()
  end: string;

  @Field()
  type: string;
}


