import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  AfterUpdate,
} from 'typeorm';
import {ObjectType, Field, Int} from 'type-graphql';

import {Task} from './Task';
import {IdType} from '../modules/core/types/CommonEntityTypes';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id!: IdType;

  @Field(() => String)
  @Column({
    type: 'timestamptz',
    // onUpdate: () => new Date(),
  })
  updatedAt = new Date();

  @Field(() => String)
  @Column({type: 'timestamptz'})
  createdAt = new Date();

  @Field(() => String)
  @Column({type: 'text', unique: true})
  username!: string;

  @Column({type: 'text'})
  password!: string;

  @Field(() => [Task])
  @OneToMany(() => Task, task => task.user)
  tasks: Task[];

  @Field()
  @Column({type: 'boolean', default: 'false'})
  isAdmin!: boolean;

  @AfterUpdate()
  updateUpdatedAt() {
    this.updatedAt = new Date();
  }
}
