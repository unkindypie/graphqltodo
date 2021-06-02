import {Arg, Ctx, Mutation, Query, Resolver} from 'type-graphql';
import {MoreThan, FindManyOptions} from 'typeorm';

import {User} from '../entities/User';
import {MyContext} from '../types';
import {Task} from '../entities/Task';
import {TaskCreateInput} from '../inputs/TaskCreateInput';
import {TaskUpdateInput} from '../inputs/TaskUpdateInput';
import {TasksQueryInput} from '../inputs/TasksQueryInput';

@Resolver()
export class TaskResolver {
  @Query(() => [Task])
  async tasks(
    @Arg('options') options: TasksQueryInput,
    @Ctx() {em}: MyContext
  ) {
    const {userId, onlyCompleted, from} = options;

    let where: FindManyOptions<Task>['where'] = {};

    if (userId) {
      where = {
        user: {
          id: userId,
        },
      };
    }

    if (onlyCompleted !== undefined) {
      where = {
        ...where,
        completed: onlyCompleted,
      };
    }

    if (from) {
      where = {
        ...where,
        dateTime: MoreThan(new Date(from)),
      };
    }

    return await em.find(Task, {
      where,
      order: {createdAt: 'DESC'},
      relations: ['user', 'kind'],
    });
  }

  @Query(() => Task, {nullable: true})
  task(@Arg('id') id: number, @Ctx() {em}: MyContext) {
    return em.findOne(Task, {id}, {relations: ['user', 'kind']});
  }

  @Mutation(() => Task)
  async createTask(
    @Arg('options') options: TaskCreateInput,
    @Ctx() {em, req}: MyContext
  ) {
    const user = await em.findOne(User, {id: req.session.userId});
    if (!user) return null;

    const task = em.create(Task, {...options, user});

    await em.save(task);

    return task;
  }

  @Mutation(() => Task, {nullable: true})
  async updateTask(
    @Arg('options') options: TaskUpdateInput,
    @Ctx() {em, req}: MyContext
  ) {
    const task = await em.findOne(Task, {
      id: options.id,
      user: {id: req.session.userId},
    });
    if (!task) {
      return null;
    }

    let isChanged = false;
    let key: keyof TaskUpdateInput;
    for (key in options) {
      if (options[key] !== undefined && key !== 'id') {
        (task[key] as any) = options[key] as any;

        isChanged = true;
      }
    }
    if (isChanged) {
      await em.save(task);
    }

    return task;
  }

  @Mutation(() => Boolean)
  async deleteTask(@Arg('id') id: number, @Ctx() {em, req}: MyContext) {
    try {
      await em.delete(Task, {id, user: {id: req.session.userId}});
    } catch (err) {
      console.error(err);
      return false;
    }
    return true;
  }
}
