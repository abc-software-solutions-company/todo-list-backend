import { IUser } from './type'

export default function extractHeader(request){
  const userFromToken: IUser = request.user
  const userId = userFromToken.userId
  const userName = userFromToken.userName
  return {userId, userName}
}
