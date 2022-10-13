import {OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  handleConnection = async (socket: Socket) => {
    const { listId } = socket.handshake.auth;
    socket.join(listId);
  };

  @SubscribeMessage('updateList')
  updateList(socket: Socket) {
    const { listId } = socket.handshake.auth;

    this.server.to(listId).emit('updateList');
  }

  @SubscribeMessage('updateListExceptMe')
  updateListExceptMe(socket: Socket) {
    const { listId } = socket.handshake.auth;
    this.server.to(listId).except(socket.id).emit('updateList');
  }
}
