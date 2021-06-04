import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';
import {Field, Int, ObjectType} from 'type-graphql';

import {IdType} from '../modules/core/types/CommonEntityTypes';

// export type TaskKindType = 'appointment' | 'event' | 'reminder';
export type TaskKindType = string;

@Entity()
@ObjectType()
export class TaskKind {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: IdType;

  @Field()
  @Column({type: 'text', unique: true})
  name!: TaskKindType;
}
