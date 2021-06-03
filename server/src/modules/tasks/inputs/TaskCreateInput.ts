import {Field, InputType} from 'type-graphql';
import {TaskKindInput} from '../../task-kinds/inputs/TaskKindInput';

@InputType()
export class TaskCreateInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  kind: TaskKindInput;

  @Field()
  dateTime: Date;
}
