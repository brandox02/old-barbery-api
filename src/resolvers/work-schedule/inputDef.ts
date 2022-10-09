import { Field, InputType } from "type-graphql";

@InputType()
export class WorkIntevalInput {
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  workScheduleDayId: number;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  start: string;

  @Field({ nullable: true })
  end: string;
}

@InputType()
export class WorkScheduleDayInput {
  @Field()
  id: number;

  @Field({ nullable: true })
  day: string;

  @Field({ nullable: true })
  start: string;

  @Field({ nullable: true })
  end: string;

  @Field(() => [WorkIntevalInput], { nullable: true })
  workIntervals: WorkIntevalInput[];
}
