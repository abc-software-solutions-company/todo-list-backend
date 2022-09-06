import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('msgToServer')
  handleMessage() {
    this.server.emit('msgToClient');
    this.logger.log(`Client frontend send message and broadcast to all other user`);
  }

  afterInit() {
    this.logger.log('Websokcet handle when first time');
  }

  handleConnection(client: Socket) {
    this.logger.log( `Client joined to todolist app`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log( `Client get out todolist app`);
  }
}
