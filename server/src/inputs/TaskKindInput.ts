import {TaskKindType} from '../entities/TaskKind';
import {Field, InputType} from 'type-graphql';

// import {Validate} from 'class-validator';
@InputType()
export class TaskKindInput {
  @Field()
  id: number;
  @Field()
  name: TaskKindType;
}
