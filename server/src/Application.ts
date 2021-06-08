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

import typeormConfig from './ormconfig';
import {__prod__} from './constants';
import {RequestContext} from './modules/core/types/RequestContext';
import {TaskResolver} from './modules/tasks/TaskResolver';
import {UserResolver} from './modules/users/UserResolver';
import {TaskKindResolver} from './modules/task-kinds/TaskKindResolver';
import {sleep} from './modules/core/utils/sleep';

export class Application {
  static didConnectionFailedFirstTime: boolean;

  static async startup() {
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
          // secure: false,
          sameSite: 'lax',
        },
        saveUninitialized: false,
        secret: process.env.REDIS_SECRET as string,
        resave: false,
      })
    );

    const apolloServer = await this.createApolloServer();

    apolloServer.applyMiddleware({app, cors: false});

    app.listen(process.env.SERVER_PORT, () => {
      console.log(`Server is up on port ${process.env.SERVER_PORT}`);
    });
  }

  static async createDBConnection() {
    useContainer(Container);
    try {
      return await createConnection(typeormConfig);
    } catch (err) {
      await sleep(5000);
      return await createConnection(typeormConfig);
    }
  }

  static createTestDBConnection({drop = false} = {}) {
    useContainer(Container);
    const ormTestConfig = {
      ...typeormConfig,
      database: ((typeormConfig.database ?? 'db') + '_test') as any,
      migrations: [__dirname + '/migrations/**/*.ts'],
      dropSchema: drop,
      migrationsRun: drop,
      logging: false,
    };

    return createConnection(ormTestConfig);
  }

  static async createApolloServer() {
    return new ApolloServer({
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
  }

  static async createTestApolloServer(
    context: RequestContext | ((...params: any[]) => RequestContext) = ({
      req,
      res,
    }): RequestContext => ({
      req: req as any,
      res,
    })
  ) {
    return new ApolloServer({
      schema: await buildSchema({
        resolvers: [TaskResolver, UserResolver, TaskKindResolver],
        validate: false,
        container: Container,
      }),
      context,
    });
  }

  static createRedisStore() {
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
