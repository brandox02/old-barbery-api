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


}

@InputType()
export class ScheduleWhereInput {
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  date: string;

  @Field({ nullable: true })
  haircutId: number;

  @Field({ nullable: true })
  userId: number;

  @Field((_) => [Date], { nullable: true })
  dates: Date[];


}
