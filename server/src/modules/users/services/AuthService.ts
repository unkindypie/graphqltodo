import {Service} from 'typedi';
import argon2 from 'argon2';
import {InjectRepository} from 'typeorm-typedi-extensions';

import {User} from '../../../entities/User';
import {UserRepository} from '../repositories/UserRepository';
import {RequestContext} from '../../core/types/RequestContext';

@Service()
export class AuthService {
  constructor(@InjectRepository() private readonly userRepo: UserRepository) {}

  /**
   * Registers new user. If user name is taken will return null. In other
   * case return User.
   * @param username user's name
   * @param password password text
   * @returns
   */
  async createUser(username: string, password: string): Promise<null | User> {
    const existingUser = await this.userRepo.findOne({
      username,
    });
    if (existingUser) {
      return null;
    }

    const hashedPassword = await argon2.hash(password);
    const user = await this.userRepo.create({
      username,
      password: hashedPassword,
    });
    await this.userRepo.save(user);

    return user;
  }

  /**
   * Checks does user able to login. Returns null in case of failure.
   * @param username
   * @param password
   * @returns
   */
  async verify(username: string, password: string): Promise<null | User> {
    const user = await this.userRepo.findOne({username});

    if (!user) {
      return null;
    }
    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      return null;
    }

    return user;
  }

  /**
   * Logs out user
   * @param context request context
   * @returns
   */
  async removeSession({req, res}: RequestContext) {
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
}
