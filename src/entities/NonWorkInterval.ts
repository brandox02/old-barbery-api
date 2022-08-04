import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";

@ObjectType()
@Entity({ name: "non_work_hours", schema: "public" })
export default class NonWorkInteval {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column({ name: "worK_schedule_day_id" })
  @Field()
  workScheduleDayId: number;

  @Column({ type: "time" })
  @Field()
  start: Date;

  @Column({ type: "time" })
  @Field()
  end: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
