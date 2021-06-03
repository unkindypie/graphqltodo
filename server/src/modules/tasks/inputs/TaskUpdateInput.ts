import {Field, InputType} from 'type-graphql';
import {TaskKindInput} from '../../task-kinds/inputs/TaskKindInput';
import {TaskCreateInput} from './TaskCreateInput';

@InputType()
export class TaskUpdateInput implements Partial<TaskCreateInput> {
  @Field()
  id: number;

  @Field({nullable: true})
  title?: string;

  @Field({nullable: true})
  description?: string;

  @Field({nullable: true})
  kind?: TaskKindInput;

  @Field({nullable: true})
  dateTime?: Date;

  // @Validate(TaskUpdateInput)
  @Field({nullable: true})
  completed?: boolean;
}
