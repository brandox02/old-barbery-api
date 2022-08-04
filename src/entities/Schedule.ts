import { now } from "lodash";
import { Field, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import Haircut from "./Haircut";
import User from "./User";

@Entity({ name: "schedules", schema: "public" })
@ObjectType()
export default class Schedule {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ name: "user_id" })
  userId: number;

  @Field()
  @ManyToOne((_) => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Field()
  @Column({ name: "haircut_id" })
  haircutId: number;

  @Field()
  @ManyToOne((_) => Haircut)
  @JoinColumn({ name: "haircut_id" })
  haircut: Haircut;

  @Field()
  @Column({
    name: "schedule_date",
    type: "timestamp",
  })
  scheduleDate: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
