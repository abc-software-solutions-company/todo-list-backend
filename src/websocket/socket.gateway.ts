import {SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload : any) {
    this.server.emit(`msgToClient_${payload.roomId}`);
  }

  @SubscribeMessage('msgDeleteListToServer')
  handleMessageDeleteList() {
    this.server.emit('msgDeleteListToClient');
  }
}
