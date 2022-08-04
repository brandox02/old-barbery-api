import { Field, InputType } from "type-graphql";

@InputType()
export class ScheduleInput {
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  userId: number;

  @Field({ nullable: true })
  haircutId: number;

  @Field({ nullable: true })
  scheduleDate: Date;

  @Field({ nullable: true })
  hourStart: number;
}
