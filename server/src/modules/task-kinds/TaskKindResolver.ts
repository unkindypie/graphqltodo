import {Arg, Mutation, Query, Resolver} from 'type-graphql';
import {InjectRepository} from 'typeorm-typedi-extensions';

import {TaskKind} from '../../entities/TaskKind';
import {TaskKindUpdateInput} from './inputs/TaskKindUpdateInput';
import {TaskKindMutationResponse} from './responses/TaskKindMutationResponse';
import {TaskKindRepository} from './repositories/TaskKindRepository';
import {Service} from 'typedi';

@Service()
@Resolver()
export class TaskKindResolver {
  constructor(
    @InjectRepository(TaskKindRepository)
    private readonly taskKindRepo: TaskKindRepository
  ) {}

  @Query(() => [TaskKind])
  async taskKinds() {
    return await this.taskKindRepo.find({});
  }

  @Mutation(() => TaskKindMutationResponse)
  async createTaskKind(
    @Arg('name') name: string
  ): Promise<TaskKindMutationResponse> {
    const existingTaskKind = await this.taskKindRepo.findOne({name});
    if (existingTaskKind) {
      return {
        errors: [{field: 'name', message: 'Task kind already exists'}],
      };
    }
    const kind = await this.taskKindRepo.create({name});

    await this.taskKindRepo.save(kind);

    return {
      kind,
    };
  }

  @Mutation(() => TaskKind, {nullable: true})
  async updateTaskKind(@Arg('options') options: TaskKindUpdateInput) {
    const taskKind = await this.taskKindRepo.findOne({id: options.id});
    if (!taskKind) {
      return null;
    }

    taskKind.name = options.name;

    await this.taskKindRepo.save(taskKind);

    return taskKind;
  }

  @Mutation(() => Boolean)
  async deleteTaskKind(@Arg('id') id: number) {
    try {
      await this.taskKindRepo.delete({id});
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }
}
