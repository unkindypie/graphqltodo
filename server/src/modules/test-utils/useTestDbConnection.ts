import {Connection} from 'typeorm';

import {Application} from '../../Application';

let connection: Connection;

beforeAll(async () => {
  connection = await Application.createTestDBConnection();
});

afterAll(() => connection.close());
