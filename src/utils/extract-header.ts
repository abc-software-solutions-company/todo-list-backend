import { IUser } from './type';

export default function extractHeader(request) {
  const userFromToken: IUser = request.user;
  const userId = userFromToken.userId;
  const name = userFromToken.name;
  return { userId, name };
}
