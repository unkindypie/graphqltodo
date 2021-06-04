import {Application} from './Application';

module.exports = async (): Promise<void> => {
  console.log('Running global setup');
  const connection = await Application.createTestDBConnection();

  await connection.dropDatabase();
  console.log('dropped test db');
  await connection.runMigrations();
  console.log('run migrations on test db');
  await connection.close();
};
