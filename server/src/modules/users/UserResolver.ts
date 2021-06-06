import {Resolver, Mutation, Arg, Ctx, Query} from 'type-graphql';
// хэш алгоритм, который лучше чем bcrypt
import argon2 from 'argon2';
import {Not} from 'typeorm';
import {InjectRepository} from 'typeorm-typedi-extensions';

import {UsernamePasswordInput} from './inputs/UsernamePasswordInput';
import {UserResponse} from './responses/UserResponse';
import {RequestContext} from '../core/types/RequestContext';
import {User} from '../../entities/User';
import {UserRepository} from './repositories/UserRepository';
import {Service} from 'typedi';
import {AuthService} from './services/AuthService';

@Service()
@Resolver()
export class UserResolver {
  constructor(
    @InjectRepository() private readonly userRepo: UserRepository,
    private readonly authService: AuthService
  ) {}

  @Query(() => UserResponse, {nullable: false})
  async me(@Ctx() {req}: RequestContext) {
    if (!req.session.userId) {
      return {
        errors: [{message: 'User is not authenticated', field: 'userId'}],
      };
    }
    const user = await this.userRepo.findOne({id: req.session.userId});

    return {user};
  }

  @Query(() => [User], {nullable: false})
  async users(@Ctx() {req}: RequestContext) {
    const users = await this.userRepo.find({
      where: {
        id: Not(req?.session?.userId),
      },
    });

    return users;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() {req}: RequestContext
  ) {
    const user = await this.authService.createUser(
      options.username,
      options.password
    );

    if (!user) {
      return {
        errors: [
          {
            field: 'username',
            message: 'Username already taken.',
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {user};
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() {req}: RequestContext
  ) {
    const user = await this.authService.verify(
      options.username,
      options.password
    );

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

    req.session.userId = user.id;

    return {user};
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() context: RequestContext) {
    return await this.authService.removeSession(context);
  }

  @Mutation(() => Boolean)
  async removeAccount(@Arg('id') id: number, @Ctx() {req}: RequestContext) {
    const requestedBy = await this.userRepo.findOne({id: req.session.userId});
    if (!requestedBy?.isAdmin || req.session.userId === id) {
      return false;
    }

    try {
      await this.userRepo.delete({id: id});
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
