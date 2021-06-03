import {createConnection} from 'typeorm';

import typeormConfig from '../ormconfig';

export const createTestDBConnection = (drop = false) => {
  return createConnection({...typeormConfig, dropSchema: drop});
};
