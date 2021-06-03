import {Service} from 'typedi';
import {Repository, EntityRepository} from 'typeorm';

import {User} from '../../../entities/User';

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {}
