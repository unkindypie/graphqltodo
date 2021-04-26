require('dotenv').config();

import {MikroORM} from '@mikro-orm/core';
import path from 'path';

import {Task} from './entities/Task';
import {User} from './entities/User';
import {TaskKind} from './entities/TaskKind';
import {__prod__} from './constants';

export default {
  entities: [Task, TaskKind, User],
  dbName: process.env.DBNAME,
  debug: !__prod__,
  type: 'postgresql',
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
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
