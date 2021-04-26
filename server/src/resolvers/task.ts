import {TaskKindType} from '../entities/TaskKind';
import {User} from '../entities/User';
import {MyContext} from '../types';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql';
import {Task} from '../entities/Task';

@InputType()
class TaskKindInput {
  @Field()
  id: number;
  @Field()
  name: TaskKindType;
}

@InputType()
class TaskCreateInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  kind: TaskKindInput;

  @Field()
  dateTime: Date;
}

@InputType()
class TaskUpdateInput implements Partial<TaskCreateInput> {
  @Field()
  id: number;

  @Field({nullable: true})
  title?: string;

  @Field({nullable: true})
  description?: string;

  @Field({nullable: true})
  kind?: TaskKindInput;

  @Field({nullable: true})
  dateTime?: Date;
}

@Resolver()
export class TaskResolver {
  @Query(() => [Task])
  async tasks(@Ctx() {em}: MyContext) {
    return await em.find(Task, {}, {populate: ['user', 'kind']});
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

    let changed = false;
    let key: keyof TaskUpdateInput;
    for (key in options) {
      if (options[key] !== undefined && key !== 'id') {
        task[key] = options[key] as any;

        changed = true;
      }
    }
    if (changed) {
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
