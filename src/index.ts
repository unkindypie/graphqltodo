import 'reflect-metadata'; // описывает ошибки type-graphql
import {MikroORM} from '@mikro-orm/core'; // бд модели
import {__prod__} from './constants';
import {Post} from './entities/Post';
import microConfig from './mikro-orm.config';
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import {HelloResolver} from './resolvers/hello';
import {PostResolver} from './resolvers/post';
import {UserResolver} from './resolvers/user';

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    // объект будет доступен из резалверов graphql
    context: () => ({em: orm.em}),
  });

  apolloServer.applyMiddleware({app});

  app.listen(4000, () => {
    console.log('Server is up on port 4000');
  });

  // const post = orm.em.create(Post, { title: 'foo' });
  // await orm.em.persistAndFlush(post);

  // const post = await orm.em.find(Post, {});
  // console.log(post);
};

main().catch(err => console.log(err));
