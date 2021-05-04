import {User} from '../entities/User';
import {MyContext} from '../types';
import {Arg, Ctx, Mutation, Query, Resolver} from 'type-graphql';
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

    let filters = {};

    if (userId) {
      filters = {
        user: {
          id: {
            $eq: userId,
          },
        },
      };
    }

    if (onlyCompleted !== undefined) {
      filters = {
        ...filters,
        completed: onlyCompleted,
      };
    }

    if (from) {
      filters = {
        ...filters,
        dateTime: {
          $gt: new Date(from),
        },
      };
    }

    return await em.find(Task, filters, {
      populate: ['user', 'kind'],
      orderBy: {['createdAt']: 'DESC'},
    });
  }

  @Query(() => Task, {nullable: true})
  task(@Arg('id') id: number, @Ctx() {em}: MyContext) {
    return em.findOne(Task, {id}, {populate: ['user', 'kind']});
  }

  @Mutation(() => Task)
  async createTask(
    @Arg('options') options: TaskCreateInput,
    @Ctx() {em, req}: MyContext
  ) {
    const user = await em.findOne(User, {id: req.session.userId});
    if (!user) return null;

    const task = em.create(Task, {...options, user});

    await em.persistAndFlush(task);

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
      await em.persistAndFlush(task);
    }

    return task;
  }

  @Mutation(() => Boolean)
  async deleteTask(@Arg('id') id: number, @Ctx() {em, req}: MyContext) {
    try {
      await em.nativeDelete(Task, {id, user: {id: req.session.userId}});
    } catch (err) {
      console.error(err);
      return false;
    }
    return true;
  }
}
