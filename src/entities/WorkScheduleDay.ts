import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from "typeorm";
import NonWorkInterval from "./NonWorkInterval";
@ObjectType()
@Entity({ name: "work_schedule_days", schema: "public" })
export default class WorkScheduleDay {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  day: string;

  @Column({ type: "time" })
  @Field()
  start: string;

  @Column({ type: "time" })
  @Field()
  end: string;

  @Field(() => [NonWorkInterval])
  @OneToMany((_) => NonWorkInterval, (n) => n.workScheduleDay, {
    cascade: true,
  })
  nonWorkIntervals: NonWorkInterval[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
