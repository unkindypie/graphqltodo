import {
  Entity,
  PrimaryKey,
  Property,
  Collection,
  OneToMany,
} from '@mikro-orm/core';
import {ObjectType, Field, Int} from 'type-graphql';
import {Task} from './Task';

@Entity()
@ObjectType()
export class User {
  @PrimaryKey()
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  @Property({type: 'date', onUpdate: () => new Date()})
  updatedAt = new Date();

  @Field(() => String)
  @Property({type: 'date'})
  createdAt = new Date();

  @Field(() => String)
  @Property({type: 'text', unique: true})
  username!: string;

  @Property({type: 'text'})
  password!: string;

  @Field(() => [Task])
  @OneToMany(() => Task, task => task.user)
  tasks = new Collection<Task>(this);
}
