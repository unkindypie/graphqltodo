import 'reflect-metadata';
import {createConnection, useContainer} from 'typeorm';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import cors from 'cors';
import {Container} from 'typeorm-typedi-extensions';
// import {Container} from 'typedi'

import typeormConfig from './ormconfig';
import {TaskResolver} from './resolvers/TaskResolver';
import {UserResolver} from './resolvers/UserResolver';
import {__prod__} from './constants';
import {RequestContext} from './types';
import {TaskKindResolver} from './resolvers/TaskKindResolver';

class Application {
  async startup() {
    await this.createDBConnection();
    const app = express();

    const redisStore = this.createRedisStore();

    // глобально настариваю корс
    app.use(cors({origin: 'http://localhost:3000', credentials: true}));

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

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [TaskResolver, UserResolver, TaskKindResolver],
        validate: false,
        container: Container,
      }),
      context: ({req, res}): RequestContext => ({
        req: req as any,
        res,
      }),
    });

    apolloServer.applyMiddleware({app, cors: false});

    app.listen(process.env.SERVER_PORT, () => {
      console.log(`Server is up on port ${process.env.SERVER_PORT}`);
    });
  }

  async createDBConnection() {
    useContainer(Container);
    return await createConnection(typeormConfig);
  }

  createRedisStore() {
    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient({
      host: process.env.REDIS_HOST ?? 'localhost',
    });

    const redisStore = new RedisStore({
      client: redisClient,
      disableTouch: true,
      host: process.env.REDIS_HOST ?? 'localhost',
    });

    return redisStore;
  }
}

new Application().startup().catch(err => console.log(err));

process.once('SIGUSR2', () => {
  process.kill(process.pid, 'SIGUSR2');
});
