import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity({ name: "haircuts", schema: "public" })
export default class Haircut {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  image: string;

  @Column({ type: "float" })
  @Field()
  price: number;

  @Column({ type: "timestamp" })
  @Field()
  duration: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
