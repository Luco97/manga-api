import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UtilsService } from '@manga/services';

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayInit {
  constructor(private _utilsService: UtilsService) {}

  afterInit(server: Server) {
    this._utilsService.mangaCreateSubject.subscribe(({ response, data }) => {
      server.emit('create/manga', {
        response,
        data,
      });
    });
  }

  handleConnection(client: Socket, ...args: any[]) {
    //listener que emite los mangas que fueron creados
    //desde que alguien a iniciado una conexion con el servidor
    this._utilsService.mangaFavoriteSubject.subscribe(({ response, data }) => {
      client.emit(`like/manga/${data.id}`, {
        response,
        data,
      });
    });
    this._utilsService.mangaDropSubject.subscribe(({ response, data }) => {
      client.emit(`dislike/manga/${data.id}`, {
        response,
        data,
      });
    });
  }
}
