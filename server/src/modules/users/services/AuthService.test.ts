import {Container} from 'typedi';

import {injectRepositories} from '../../test-utils/injectRepositories';
import {UserRepository} from '../repositories/UserRepository';
import {AuthService} from './AuthService';

class MockedUserRepository {
  static findOne: jest.MockedFunction<typeof UserRepository.prototype.findOne>;
  static create: jest.MockedFunction<typeof UserRepository.prototype.create>;
  static save: jest.MockedFunction<typeof UserRepository.prototype.save>;

  static setupMocks() {
    this.findOne = jest.fn().mockResolvedValue(undefined);
    this.save = jest.fn().mockResolvedValue(undefined);
    this.create = jest.fn().mockImplementation(user => user);
  }
}

describe('AuthService', () => {
  beforeAll(() => {
    injectRepositories({
      getCustomRepository: (repositoryType: any) => {
        switch (repositoryType) {
          case UserRepository:
            return MockedUserRepository;
          default:
            console.warn(`No mock repository found for ${repositoryType}`);
            return null;
        }
      },
    });
  });

  beforeEach(() => {
    MockedUserRepository.setupMocks();
  });

  it('Creating user', async () => {
    const authService = await Container.get(AuthService);

    const user = await authService.createUser('Admin', '12345');
    expect(user?.username).toBe('Admin');
    expect(MockedUserRepository.save).toHaveBeenCalled();
  });

  it('Fail verifying with wrong password', async () => {
    const authService = await Container.get(AuthService);
    const createdUser = await authService.createUser('Admin', '12345');

    expect(createdUser?.username).toBe('Admin');

    MockedUserRepository.findOne.mockResolvedValue(createdUser!);

    const user = await authService.verify('Admin', '123456');

    expect(user).toBeNull();
  });

  it('Verify user credentials', async () => {
    const authService = await Container.get(AuthService);
    const createdUser = await authService.createUser('Admin', '12345');

    expect(createdUser?.username).toBe('Admin');

    MockedUserRepository.findOne.mockResolvedValue(createdUser!);

    const user = await authService.verify('Admin', '12345');

    expect(user).toEqual(createdUser);
  });

  it('Remove session', async () => {
    const authService = await Container.get(AuthService);
    const mockedContext = {
      req: {
        session: {
          destroy: jest.fn().mockImplementation(fn => fn()),
        },
      },
      res: {
        clearCookie: jest.fn(),
      },
    };

    await authService.removeSession(mockedContext as any);

    expect(mockedContext.req.session.destroy).toBeCalled();
    expect(mockedContext.res.clearCookie).toBeCalled();
  });
});
