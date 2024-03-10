import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketRequestModel } from 'src/dto/socket-request-model';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({ cors: true })
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly userService: UserService) {}

  async handleConnection(socket: Socket) {
    let auth_token = socket.handshake.headers.authorization;
    auth_token = auth_token.split(' ')[1];
    const user =
      await this.userService.getUserFromAuthenticationToken(auth_token);
  }

  @SubscribeMessage('join')
  async handleJoin(
    @MessageBody() email: string,
    @ConnectedSocket() socket: Socket,
  ) {
    this.server.in(socket.id).socketsJoin(email);
  }

  @SubscribeMessage('like-dislike')
  async listenForMessages(
    @MessageBody() message: SocketRequestModel,
    @ConnectedSocket() socket: Socket,
  ) {
    this.server
      .to(message.receiver)
      .emit('message', `${message.sender} ${message.type} you`);
  }
}
