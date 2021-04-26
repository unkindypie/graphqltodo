import {Entity, PrimaryKey, Property, Unique} from '@mikro-orm/core';
import {Field, Int, ObjectType} from 'type-graphql';

// export type TaskKindType = 'appointment' | 'event' | 'reminder';
export type TaskKindType = string;

@Entity()
@ObjectType()
export class TaskKind {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field()
  @Unique()
  @Property({type: 'text'})
  name!: TaskKindType;
}
