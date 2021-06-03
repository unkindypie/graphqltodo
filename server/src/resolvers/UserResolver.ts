import {Resolver, Mutation, Arg, Ctx, Query} from 'type-graphql';
// хэш алгоритм, который лучше чем bcrypt
import argon2 from 'argon2';
import {Not} from 'typeorm';
import {InjectRepository} from 'typeorm-typedi-extensions';

import {UsernamePasswordInput} from '../inputs/UsernamePasswordInput';
import {UserResponse} from '../responses/UserResponse';
import {RequestContext} from '../types';
import {User} from '../entities/User';
import {UserRepository} from '../repositories/UserRepository';
import {Service} from 'typedi';

@Service()
@Resolver()
export class UserResolver {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository
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
        id: Not(req.session.userId),
      },
    });

    return users;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() {req}: RequestContext
  ) {
    const existingUser = await this.userRepo.findOne({
      username: options.username,
    });
    if (existingUser) {
      return {
        errors: [
          {
            field: 'username',
            message: 'Username already taken.',
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(options.password);
    const user = await this.userRepo.create({
      username: options.username,
      password: hashedPassword,
    });
    await this.userRepo.save(user);

    req.session.userId = user.id;

    return {user};
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() {req}: RequestContext
  ) {
    const user = await this.userRepo.findOne({username: options.username});
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

    await this.userRepo.save(user);
    return {user};
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() {req, res}: RequestContext) {
    return new Promise(resolve =>
      req.session.destroy(err => {
        res.clearCookie(process.env.AUTH_COOKIE_NAME as string);

        if (err) {
          console.log(err);
          resolve(false);
        } else {
          resolve(true);
        }
      })
    );
  }

  @Mutation(() => Boolean)
  async removeAccount(@Arg('id') id: number, @Ctx() {req}: RequestContext) {
    const requestedBy = await this.userRepo.findOne({id: req.session.userId});
    if (!requestedBy?.isAdmin) {
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
