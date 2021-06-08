// eslint-disable-next-line node/no-unpublished-require
require('ts-node').register({extends: '../tsconfig.json', transpileOnly: true});
import {Application} from '../../Application';

module.exports = async (): Promise<void> => {
  console.log('Running global setup...');
  const connection = await Application.createTestDBConnection({drop: true});

  console.log('Database dropped, migrations applied.');

  await connection.close();
};
