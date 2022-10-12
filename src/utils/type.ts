import { Request } from 'express';

export interface IUser {
  userId: string;
  name: string;
}

export interface IRequest extends Request {
 user: IUser
}
