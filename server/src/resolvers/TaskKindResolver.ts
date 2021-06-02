import {TaskKind} from '../entities/TaskKind';
import {MyContext} from '../types';
import {Arg, Ctx, Mutation, Query, Resolver} from 'type-graphql';
import {TaskKindUpdateInput} from '../inputs/TaskKindUpdateInput';
import {TaskKindMutationResponse} from '../responses/TaskKindMutationResponse';

@Resolver()
export class TaskKindResolver {
  @Query(() => [TaskKind])
  async taskKinds(@Ctx() {em}: MyContext) {
    return await em.find(TaskKind, {});
  }

  @Mutation(() => TaskKindMutationResponse)
  async createTaskKind(
    @Arg('name') name: string,
    @Ctx() {em}: MyContext
  ): Promise<TaskKindMutationResponse> {
    const existingTaskKind = await em.findOne(TaskKind, {name});
    if (existingTaskKind) {
      return {
        errors: [{field: 'name', message: 'Task kind already exists'}],
      };
    }
    const kind = await em.create(TaskKind, {name});

    await em.save(kind);

    return {
      kind,
    };
  }

  @Mutation(() => TaskKind, {nullable: true})
  async updateTaskKind(
    @Arg('options') options: TaskKindUpdateInput,
    @Ctx() {em}: MyContext
  ) {
    const taskKind = await em.findOne(TaskKind, {id: options.id});
    if (!taskKind) {
      return null;
    }

    taskKind.name = options.name;

    await em.save(taskKind);

    return taskKind;
  }

  @Mutation(() => Boolean)
  async deleteTaskKind(@Arg('id') id: number, @Ctx() {em}: MyContext) {
    try {
      await em.delete(TaskKind, {id});
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }
}
