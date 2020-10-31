import {Entity, PrimaryKey, Property} from '@mikro-orm/core';
import {ObjectType, Field, Int} from 'type-graphql';

/**
 * Класс является одновременно и типом для type-graphql
 * (ObjectType)
 *  и mikro-моделью в бд
 *  (Entity)
 */

@ObjectType()
@Entity()
export class Post {
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
}
