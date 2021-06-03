import {Arg, Ctx, Mutation, Query, Resolver} from 'type-graphql';
import {MoreThan, FindManyOptions} from 'typeorm';
import {InjectRepository} from 'typeorm-typedi-extensions';

import {RequestContext} from '../core/types/RequestContext';
import {Task} from '../../entities/Task';
import {TaskCreateInput} from './inputs/TaskCreateInput';
import {TaskUpdateInput} from './inputs/TaskUpdateInput';
import {TasksQueryInput} from './inputs/TasksQueryInput';
import {TaskRepository} from './repositories/TaskRepository';
import {Service} from 'typedi';

@Service()
@Resolver()
export class TaskResolver {
  constructor(
    @InjectRepository(TaskRepository) private readonly taskRepo: TaskRepository
  ) {}

  @Query(() => [Task])
  async tasks(@Arg('options') options: TasksQueryInput) {
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

    return await this.taskRepo.find({
      where,
      order: {createdAt: 'DESC'},
      relations: ['user', 'kind'],
    });
  }

  @Query(() => Task, {nullable: true})
  task(@Arg('id') id: number) {
    return this.taskRepo.findOne({id}, {relations: ['user', 'kind']});
  }

  @Mutation(() => Task)
  async createTask(
    @Arg('options') options: TaskCreateInput,
    @Ctx() {req}: RequestContext
  ) {
    const user = await this.taskRepo.findOne({id: req.session.userId});
    if (!user) return null;

    const task = this.taskRepo.create({...options, user});

    await this.taskRepo.save(task);

    return task;
  }

  @Mutation(() => Task, {nullable: true})
  async updateTask(
    @Arg('options') options: TaskUpdateInput,
    @Ctx() {req}: RequestContext
  ) {
    const task = await this.taskRepo.findOne({
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
      await this.taskRepo.save(task);
    }

    return task;
  }

  @Mutation(() => Boolean)
  async deleteTask(@Arg('id') id: number, @Ctx() {req}: RequestContext) {
    try {
      await this.taskRepo.delete({id, user: {id: req.session.userId}});
    } catch (err) {
      console.error(err);
      return false;
    }
    return true;
  }
}
