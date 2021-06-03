import {Service} from 'typedi';
import {EntityRepository, Repository} from 'typeorm';

import {TaskKind} from '../entities/TaskKind';

@Service()
@EntityRepository(TaskKind)
export class TaskKindRepository extends Repository<TaskKind> {}
