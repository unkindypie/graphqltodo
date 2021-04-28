import {EntityManager, IDatabaseDriver, Connection} from '@mikro-orm/core';
import {Request, Response} from 'express';
import {Session} from 'express-session';
import {ObjectType, Field} from 'type-graphql';

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Request & {session: Session & {userId: number}};
  res: Response;
};

@ObjectType()
export class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}
