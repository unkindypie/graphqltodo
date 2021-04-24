import {
  Resolver,
  Mutation,
  InputType,
  Field,
  Arg,
  Ctx,
  ObjectType,
  Query,
} from 'type-graphql';
import {MyContext} from '../types';
import {User} from '../entities/User';
// хэш алгоритм, который лучше чем bcrypt
import argon2 from 'argon2';

// декоратор для создания объекта-аргумента
@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], {nullable: true})
  errors?: FieldError[];

  @Field(() => User, {nullable: true})
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => UserResponse, {nullable: false})
  async me(@Ctx() {req, em}: MyContext) {
    if (!req.session.userId) {
      return {
        errors: [{message: 'User is not authenticated', field: 'userId'}],
      };
    }
    const user = await em.findOne(User, {id: req.session.userId});

    return {user};
  }

  // тут как аргумент используется объект с помощью InputType декоратора
  @Mutation(() => User)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() {em, req}: MyContext
  ) {
    const hashedPassword = await argon2.hash(options.password);
    const user = await em.create(User, {
      username: options.username,
      password: hashedPassword,
    });
    await em.persistAndFlush(user);

    req.session.userId = user.id;

    return user;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() {em, req}: MyContext
  ) {
    const user = await em.findOne(User, {username: options.username});
    if (!user) {
      return {
        errors: [
          {
            field: 'username',
            message: 'password or login is invalid.',
          },
          {
            field: 'password',
            message: 'password or login is invalid.',
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [
          {
            field: 'username',
            message: 'password or login is invalid.',
          },
          {
            field: 'password',
            message: 'password or login is invalid.',
          },
        ],
      };
    }

    req.session.userId = user.id;

    await em.persistAndFlush(user);
    return {user};
  }
}
