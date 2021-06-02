require('dotenv').config({path: '../.env'});

import {createConnection} from 'typeorm';

import {Task} from './entities/Task';
import {User} from './entities/User';
import {TaskKind} from './entities/TaskKind';
import {__prod__} from './constants';

console.log(
  `TypeORM is configured to connect to: ${process.env.DBNAME} with ${process.env.DBUSER}:${process.env.DBPASSWORD}, host: ${process.env.DB_HOST}`
);

const config = {
  type: 'postgres',
  entities: [Task, TaskKind, User],
  database: process.env.DBNAME,
  debug: !__prod__,
  logging: !__prod__,
  user: process.env.DBUSER,
  username: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  host: process.env.DB_HOST ?? 'localhost',
  synchronize: false,
  migrationsRun: true,
  migrationsTableName: 'migrations_table',
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'migrations',
  },
} as Parameters<typeof createConnection>[0];

export = config;
