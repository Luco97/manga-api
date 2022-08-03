import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
//DB
//Modules
import { SharedModule } from '../shared/shared.module';
import { UserEntityModule } from '@db/user/user-entity.module';
import { MangaEntitiesModule } from '@db/manga/manga-entities.module';
//Guard
import { PayloadMiddleware } from './middleware/payload.middleware';
import { RelationsMiddleware } from './middleware/relations.middleware';
import { OrderMangaMiddleware } from './middleware/order-manga.middleware';
//Controllers
import { UserController } from './controller/user.controller';
import { MangaController } from './controller/manga.controller';
import { GenreController } from './controller/genre.controller';
import { ArtistController } from './controller/artist.controller';
import { LanguageController } from './controller/language.controller';
// Services
import { UtilsService } from './services/utils.service';
import { UserService } from './services/user.service';
import { MangaService } from './services/manga.service';
import { GenreService } from './services/genre.service';
import { ArtistService } from './services/artist.service';
import { CommentService } from './services/comment.service';
import { LanguageService } from './services/language.service';
// Gateways
import { EventsGateway } from './events/events.gateway';

@Module({
  imports: [UserEntityModule, MangaEntitiesModule, SharedModule],
  controllers: [
    UserController,
    MangaController,
    GenreController,
    ArtistController,
    LanguageController,
  ],
  providers: [
    UserService,
    MangaService,
    GenreService,
    UtilsService,
    ArtistService,
    CommentService,
    LanguageService,
    // Gateways
    EventsGateway,
  ],
})
export class MangaModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PayloadMiddleware)
      .forRoutes(
        {
          path: 'user/favorites',
          method: RequestMethod.POST,
        },
        {
          path: 'user/favorites',
          method: RequestMethod.PUT,
        },
        {
          path: 'user/check',
          method: RequestMethod.PUT,
        },
        {
          path: 'manga',
          method: RequestMethod.POST,
        },
        {
          path: 'manga/comment/:manga_id',
          method: RequestMethod.POST,
        },
        {
          path: 'manga/comment/:manga_id',
          method: RequestMethod.PUT,
        },
      )
      .apply(RelationsMiddleware)
      .forRoutes(
        {
          path: 'manga',
          method: RequestMethod.POST,
        },
        {
          path: 'manga/:id',
          method: RequestMethod.PUT,
        },
        {
          path: 'artist',
          method: RequestMethod.POST,
        },
        {
          path: 'artist/:id',
          method: RequestMethod.PUT,
        },
        {
          path: 'genre',
          method: RequestMethod.POST,
        },
        {
          path: 'genre/:id',
          method: RequestMethod.PUT,
        },
      )
      .apply(OrderMangaMiddleware)
      .forRoutes(
        {
          path: 'manga',
          method: RequestMethod.POST,
        },
        {
          path: 'manga/:id',
          method: RequestMethod.POST,
        },
      );
  }
}
