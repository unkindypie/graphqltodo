import {TaskKind} from '../entities/TaskKind';
import {FieldError} from '../types';
import {Field, ObjectType} from 'type-graphql';

@ObjectType()
export class TaskKindMutationResponse {
  @Field(() => [FieldError], {nullable: true})
  errors?: FieldError[];

  @Field(() => TaskKind, {nullable: true})
  kind?: TaskKind;
}
