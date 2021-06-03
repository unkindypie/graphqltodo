import {Field, InputType} from 'type-graphql';

@InputType()
export class TasksQueryInput {
  @Field({nullable: true})
  userId?: number;
  @Field({nullable: true})
  from?: Date;
  @Field({nullable: true})
  onlyCompleted?: boolean;
}
