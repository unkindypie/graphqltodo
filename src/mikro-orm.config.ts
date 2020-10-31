import {MikroORM} from '@mikro-orm/core';

import {Post} from './entities/Post';
import {User} from './entities/User';
import {__prod__} from './constants';
import path from 'path';

export default {
  entities: [Post, User],
  dbName: 'handmade-reddit',
  debug: !__prod__,
  type: 'postgresql',
  user: 'admin',
  password: 'redditucks',
  migrations: {
    tableName: 'mikro_orm_migrations', // name of database table with log of executed transactions
    path: path.join(__dirname, './migrations'), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
    transactional: true, // wrap each migration in a transaction
    disableForeignKeys: true, // wrap statements with `set foreign_key_checks = 0` or equivalent
    allOrNothing: true, // wrap all migrations in master transaction
    dropTables: true, // allow to disable table dropping
    safe: false, // allow to disable table and column dropping
    emit: 'ts', // migration generation mode
  },
  //получаю интерфейс первого параметра init, чтоб включить
  // autocomlition
} as Parameters<typeof MikroORM.init>[0];
