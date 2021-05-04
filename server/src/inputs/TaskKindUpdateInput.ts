import {Field, InputType} from 'type-graphql';

@InputType()
export class TaskKindUpdateInput {
  @Field()
  name: string;
  @Field()
  id: number;
}
