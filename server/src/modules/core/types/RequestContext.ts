import {Request, Response} from 'express';
import {Session} from 'express-session';

export type RequestContext = {
  req: Request & {session: Session & {userId: number}};
  res: Response;
};
