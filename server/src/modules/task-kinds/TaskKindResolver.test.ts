import {Connection} from 'typeorm';

import {Application} from '../../Application';

describe('TaskKindResolvers', () => {
  let connection: Connection;

  beforeAll(async () => {
    console.log('creating test connection');
    connection = await Application.createTestDBConnection(true);
  });

  afterAll(() => connection.close());

  it('Get task kinds', async () => {
    const apolloServer = await Application.createTestApolloServer({});

    const response = await apolloServer.executeOperation({
      query: `
        query TaskKinds {
          taskKinds {
            name
            id
          }
        }
      `,
    });

    expect(response.errors).toBeUndefined();

    expect(response.data).toEqual({
      taskKinds: [
        {
          name: 'appointment',
          id: 1,
        },
        {
          name: 'event',
          id: 2,
        },
        {
          name: 'reminder',
          id: 3,
        },
      ],
    });
  });

  it('Creating task kind and find it in get query', async () => {
    const apolloServer = await Application.createTestApolloServer({});

    const mutationResponse = await apolloServer.executeOperation({
      query: `
        mutation CreateTaskKind($name: String!) {
          createTaskKind(name:$name) {
            kind {
              id
              name
            }
            errors {
              field
              message
            }
          }  
        }
      `,
      variables: {name: 'Dummy_kind'},
    });

    expect(mutationResponse.errors).toBeUndefined();
    expect(mutationResponse.data?.errors).toBeFalsy();

    const kindId = mutationResponse.data?.createTaskKind.kind.id;

    expect(typeof kindId).toBe('number');

    const queryResponse = await apolloServer.executeOperation({
      query: `
        query TaskKinds {
          taskKinds {
            name
            id
          }
        }
      `,
    });

    expect(queryResponse.errors).toBeUndefined();

    expect(queryResponse.data?.taskKinds).toContainEqual(
      mutationResponse.data?.createTaskKind.kind
    );
  });
});
