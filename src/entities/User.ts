import mongoose, { Schema, Types } from "mongoose";
import { Field, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity({ name: "users", schema: "public" })
export default class User {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  username: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @Column()
  @Field()
  firstname: string;

  @Column()
  @Field()
  lastname: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  image?: string;

  @Column({ name: "is_admin", default: false })
  @Field()
  isAdmin: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
