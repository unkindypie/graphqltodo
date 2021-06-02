import 'reflect-metadata';
import {createConnection} from 'typeorm';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import cors from 'cors';

import typeormConfig from './ormconfig';
import {TaskResolver} from './resolvers/TaskResolver';
import {UserResolver} from './resolvers/UserResolver';
import {__prod__} from './constants';
import {MyContext} from './types';
import {TaskKindResolver} from './resolvers/TaskKindResolver';

const main = async () => {
  const dbConnection = await createConnection(typeormConfig);

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient({
    host: process.env.REDIS_HOST ?? 'localhost',
  });

  // console.log(`Connecting to redis: ${process.env.REDIS_HOST}`);
  // глобально настариваю корс
  app.use(cors({origin: 'http://localhost:3000', credentials: true}));

  const redisStore = new RedisStore({
    client: redisClient,
    disableTouch: true,
    host: process.env.REDIS_HOST ?? 'localhost',
  });

  // редис/куки
  app.use(
    session({
      name: process.env.AUTH_COOKIE_NAME,
      store: redisStore,
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
      resolvers: [TaskResolver, UserResolver, TaskKindResolver],
      validate: false,
    }),
    // объект будет доступен из резалверов graphql
    context: ({req, res}): MyContext => ({
      em: dbConnection.manager,
      req: req as any,
      res,
    }),
  });

  apolloServer.applyMiddleware({app, cors: false});

  app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is up on port ${process.env.SERVER_PORT}`);
  });
};

main().catch(err => console.log(err));

process.once('SIGUSR2', () => {
  process.kill(process.pid, 'SIGUSR2');
});
