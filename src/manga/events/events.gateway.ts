import { MangaService } from '@manga/services';
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection {

  constructor(
    private _mangaService: MangaService
  ) {}
  
  handleConnection(client: Socket, ...args: any[]) {

    this._mangaService.mangaSubject.subscribe( ({ response, data }) => {
      client.emit('ost', response);
    });

  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): { numero: number; palabra: string} {
    console.log('--> client!!' , client);
    console.log('--> payload!!' , payload);
    return {
      numero: 10,
      palabra: 'un string'
    };
  }
}
