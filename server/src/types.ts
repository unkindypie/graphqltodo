import {Request, Response} from 'express';
import {Session} from 'express-session';
import {ObjectType, Field} from 'type-graphql';
import {EntityManager} from 'typeorm';

export type MyContext = {
  em: EntityManager;
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
