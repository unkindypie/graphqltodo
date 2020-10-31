import {
  Resolver,
  Query,
  Mutation,
  InputType,
  Field,
  Arg,
  Ctx,
} from 'type-graphql';
import { MyContext } from 'src/types';

// декоратор для создания объекта-аргумента
@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  // тут как аргумент используется объект с помощью InputType декоратора
  @Mutation(() => String)
  register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ) {
    return 'hello world';
  }
}
