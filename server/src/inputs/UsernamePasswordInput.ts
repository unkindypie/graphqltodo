import {InputType, Field} from 'type-graphql';

// декоратор для создания объекта-аргумента

@InputType()
export class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}
