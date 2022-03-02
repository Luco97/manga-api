import { Manga } from '@interface/mangaResponses.interface';
import { MangaService } from '@manga/services';
import { OnGatewayConnection, OnGatewayInit, WebSocketGateway } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayInit {

  constructor(
    private _mangaService: MangaService
  ) {}

  afterInit(server: Server) {
    this._mangaService.mangaFavoriteSubject.subscribe( ({response, data}) => {
      server.emit(`favorite:manga:${data.id}`, data);
    })
  }
  
  handleConnection(client: Socket, ...args: any[]) {

    //listener que emite los mangas que fueron creados 
    //desde que alguien a iniciado una conexion con el servidor
    this._mangaService.mangaCreateSubject.subscribe( ({ response, data }) => {
      client.emit('manga-create-controller', {
        response,
        data
      });
    });

  }

}
