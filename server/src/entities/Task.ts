import {
  Entity,
  ManyToOne,
  Column,
  PrimaryGeneratedColumn,
  AfterUpdate,
} from 'typeorm';
import {ObjectType, Field, Int} from 'type-graphql';

import {TaskKind} from './TaskKind';
import {User} from './User';
import {IdType} from '../modules/core/types/CommonEntityTypes';

@ObjectType()
@Entity()
export class Task {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: IdType;

  @Field(() => String)
  @Column({type: 'timestamptz'})
  createdAt = new Date();

  @Field(() => String)
  @Column({
    type: 'timestamptz',
  })
  updatedAt = new Date();

  @Field()
  @Column({type: 'text'})
  title!: string;

  @Field()
  @Column({type: 'text'})
  description!: string;

  @Field()
  @ManyToOne(() => TaskKind)
  kind!: TaskKind;

  @Field(() => User)
  @ManyToOne(() => User, user => user.tasks, {onDelete: 'CASCADE'})
  user!: User;

  @Field(() => String)
  @Column({type: 'timestamptz'})
  dateTime!: Date;

  @Field()
  @Column({type: 'boolean', default: false})
  completed!: boolean;

  @AfterUpdate()
  updateUpdatedAt() {
    this.updatedAt = new Date();
  }
}
