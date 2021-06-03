import {Repository, EntityRepository} from 'typeorm';
import {Service} from 'typedi';

import {Task} from '../../../entities/Task';

@Service()
@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {}
