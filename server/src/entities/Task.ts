import {Entity, ManyToOne, PrimaryKey, Property} from '@mikro-orm/core';
import {ObjectType, Field, Int} from 'type-graphql';
import {TaskKind} from './TaskKind';
import {User} from './User';

/**
 * Класс является одновременно и типом для type-graphql
 * (ObjectType)
 *  и mikro-моделью в бд
 *  (Entity)
 */

@ObjectType()
@Entity()
export class Task {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({type: 'date'})
  createdAt = new Date();

  @Field(() => String)
  @Property({type: 'date', onUpdate: () => new Date()})
  updatedAt = new Date();

  @Field()
  @Property({type: 'text'})
  title!: string;

  @Field()
  @Property({type: 'text'})
  description!: string;

  @Field()
  @ManyToOne(() => TaskKind)
  kind!: TaskKind;

  @Field(() => User)
  @ManyToOne(() => User, {onDelete: 'cascade'})
  user!: User;

  @Field(() => String)
  @Property({type: 'date'})
  dateTime!: Date;
}
