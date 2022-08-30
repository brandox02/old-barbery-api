import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  RelationId,
} from "typeorm";
import WorkScheduleDay from "./WorkScheduleDay";

@ObjectType()
@Entity({ name: "non_work_hour_intervals", schema: "public" })
export default class NonWorkInteval {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column({ name: "work_schedule_day_id", nullable: true })
  @Field()
  workScheduleDayId: number;

  @Column({ name: "description", nullable: true })
  @Field({ nullable: true })
  description: string;

  @ManyToOne(() => WorkScheduleDay, (w) => w.nonWorkIntervals)
  @JoinColumn({
    name: "work_schedule_day_id",
  })
  workScheduleDay: WorkScheduleDay;

  @Column({ type: "time" })
  @Field()
  start: string;

  @Column({ type: "time" })
  @Field()
  end: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
