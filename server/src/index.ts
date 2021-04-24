require('dotenv').config();
import 'reflect-metadata'; // описывает ошибки type-graphql
import {MikroORM} from '@mikro-orm/core'; // бд модели
import microConfig from './mikro-orm.config';
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import {HelloResolver} from './resolvers/hello';
import {PostResolver} from './resolvers/post';
import {UserResolver} from './resolvers/user';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import {__prod__} from './constants';
import {MyContext} from './types';

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      name: 'qid',
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

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    // объект будет доступен из резалверов graphql
    context: ({req, res}): MyContext => ({em: orm.em, req: req as any, res}),
  });

  apolloServer.applyMiddleware({app});

  app.listen(process.env.PORT, () => {
    console.log(`Server is up on port ${process.env.PORT}`);
  });

  // const post = orm.em.create(Post, { title: 'foo' });
  // await orm.em.persistAndFlush(post);

  // const post = await orm.em.find(Post, {});
  // console.log(post);
};

main().catch(err => console.log(err));
