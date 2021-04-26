require('dotenv').config();
import 'reflect-metadata'; // описывает ошибки type-graphql
import {MikroORM} from '@mikro-orm/core'; // бд модели
import microConfig from './mikro-orm.config';
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import {TaskResolver} from './resolvers/task';
import {UserResolver} from './resolvers/user';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import {__prod__} from './constants';
import {MyContext} from './types';
import cors from 'cors';

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  // глобально настариваю корс
  app.use(cors({origin: 'http://localhost:3000', credentials: true}));

  // редис/куки
  app.use(
    session({
      name: process.env.AUTH_COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years ^_^
        httpOnly: true, // нет доступа к куки из js
        secure: __prod__, // куки будет только для https
        sameSite: 'lax',
      },
      saveUninitialized: false,
      secret: process.env.REDIS_SECRET as string,
      resave: false,
    })
  );

  // аполо/graphql
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [TaskResolver, UserResolver],
      validate: false,
    }),
    // объект будет доступен из резалверов graphql
    context: ({req, res}): MyContext => ({em: orm.em, req: req as any, res}),
  });

  apolloServer.applyMiddleware({app, cors: false});

  app.listen(process.env.PORT, () => {
    console.log(`Server is up on port ${process.env.PORT}`);
  });
};

main().catch(err => console.log(err));

process.once('SIGUSR2', () => {
  process.kill(process.pid, 'SIGUSR2');
});