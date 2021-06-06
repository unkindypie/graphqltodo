import {Application} from '../../Application';
import '../test-utils/useTestDbConnection';

const REGISTER_MUTATION = `
  mutation Register($username: String!, $password: String!) {
    register(options: { username: $username, password: $password }) {
      user {
        id
        updatedAt
        createdAt
        username
      }
      errors {
        field
        message
      }
    }
  }
`;

const RM_ACCOUNT_MUTATION = `
  mutation RemoveAccount($id:Float!) {
    removeAccount(id:$id)
  }
`;

describe('UserResolver', () => {
  it('Register account and login to it, request user data', async () => {
    const context = {
      req: {session: {}} as any,
      res: {} as any,
    };
    const apolloServer = await Application.createTestApolloServer(context);

    const registerResponse = await apolloServer.executeOperation({
      query: REGISTER_MUTATION,
      variables: {
        username: 'Max',
        password: 'qwerty12345',
      },
    });

    expect(registerResponse.errors).toBeUndefined();
    expect(registerResponse.data?.register?.errors).toBeFalsy();
    expect(registerResponse.data?.register?.user?.username).toBe('Max');
    expect(context.req?.session?.userId).toBe(
      registerResponse.data?.register?.user?.id
    );

    const loginResponse = await apolloServer.executeOperation({
      query: `
        mutation {
          login(options:{username:"Max", password:"qwerty12345"}) {
            errors { field message },
            user { id updatedAt createdAt username}
          }
        }
      `,
    });

    expect(loginResponse.errors).toBeUndefined();
    expect(loginResponse.data?.login?.errors).toBeFalsy();
    expect(loginResponse.data?.login?.user?.username).toBe('Max');
    expect(context.req?.session?.userId).toBe(
      loginResponse.data?.login?.user?.id
    );

    const meResponse = await apolloServer.executeOperation({
      query: `
        query{
          me {
            errors {field, message},
            user {username,createdAt }
          }
        }
      `,
    });

    expect(meResponse.errors).toBeUndefined();
    expect(meResponse.data?.me?.errors).toBeFalsy();
    expect(meResponse.data?.me?.user?.username).toBe('Max');
  });

  it('Fail registering user with existing name', async () => {
    const context = {
      req: {session: {}} as any,
      res: {} as any,
    };
    const apolloServer = await Application.createTestApolloServer(context);

    const registerResponse = await apolloServer.executeOperation({
      query: REGISTER_MUTATION,
      variables: {
        username: 'Admin',
        password: 'qwerty12345',
      },
    });

    expect(registerResponse.errors).toBeUndefined();
    expect(registerResponse.data?.register.user).toBeNull();
    expect(registerResponse.data?.register.errors).toContainEqual({
      field: 'username',
      message: 'Username already taken.',
    });
  });

  it('Fail logging in to admin account with wrong credentials', async () => {
    const context = {
      req: {session: {}} as any,
      res: {} as any,
    };
    const apolloServer = await Application.createTestApolloServer(context);

    const loginResponse = await apolloServer.executeOperation({
      query: `
        mutation {
          login(options:{username:"Admin", password:"here_is_dummy_password"}) {
            errors { field message },
            user { id updatedAt createdAt username}
          }
        }
      `,
    });

    expect(loginResponse.errors).toBeUndefined();
    expect(loginResponse.data?.login.user).toBeNull();
    expect(loginResponse.data?.login.errors).toEqual([
      {
        field: 'username',
        message: 'password or login is invalid.',
      },
      {
        field: 'password',
        message: 'password or login is invalid.',
      },
    ]);
  });

  it('Create user and remove him', async () => {
    const context = {
      req: {session: {}} as any,
      res: {} as any,
    };
    const apolloServer = await Application.createTestApolloServer(context);
    const registerResponse = await apolloServer.executeOperation({
      query: REGISTER_MUTATION,
      variables: {
        username: 'DeleteMe',
        password: 'qwerty12345',
      },
    });

    expect(registerResponse.errors).toBeUndefined();
    expect(registerResponse.data?.register?.errors).toBeFalsy();

    // Admin's id
    context.req.session.userId = 1;

    const removeAccountResponse = await apolloServer.executeOperation({
      query: RM_ACCOUNT_MUTATION,
      variables: {
        id: registerResponse.data?.register?.user?.id,
      },
    });

    expect(removeAccountResponse.data?.removeAccount).toBe(true);
  });

  it('Fail removing yourself', async () => {
    const context = {
      req: {session: {}} as any,
      res: {} as any,
    };
    const apolloServer = await Application.createTestApolloServer(context);

    // Admin's id
    context.req.session.userId = 1;

    const removeAccountResponse = await apolloServer.executeOperation({
      query: RM_ACCOUNT_MUTATION,
      variables: {
        id: 1,
      },
    });

    expect(removeAccountResponse.data?.removeAccount).toBe(false);
  });

  it('Get users', async () => {
    const context = {
      req: {session: {}} as any,
      res: {} as any,
    };
    const apolloServer = await Application.createTestApolloServer(context);

    context.req.session.userId = 0;

    const response = await apolloServer.executeOperation({
      query: `
        query Users {
          users {
            id
            isAdmin
            username
          }
        }
      `,
    });

    expect(response.data?.users?.length).toBeGreaterThan(0);
    expect(response.data?.users).toContainEqual({
      username: 'Admin',
      isAdmin: true,
      id: 1,
    });
  });
});
