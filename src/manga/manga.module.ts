import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
//DB
import { MangaEntitiesModule } from '../db/manga-entities/manga-entities.module';
//Modules
import { SharedModule } from '../shared/shared.module';
//Guard
import { PayloadMiddleware } from './middleware/payload.middleware';
import { RelationsMiddleware } from './middleware/relations.middleware';
import { OrderMangaMiddleware } from './middleware/order-manga.middleware';
//Controllers
import { MangaController } from './controller/manga.controller';
import { ArtistController } from './controller/artist.controller';
import { GenreController } from './controller/genre.controller';
import { LanguageController } from './controller/language.controller';
import { MangaService } from './services/manga.service';
import { ArtistService } from './services/artist.service';
import { GenreService } from './services/genre.service';
import { LanguageService } from './services/language.service';
import { UserService } from './services/user.service';
import { UserEntityModule } from '@db/user/user-entity.module';
import { UserController } from './controller/user.controller';
import { EventsGateway } from './events/events.gateway';
import { UtilsService } from './services/utils.service';

@Module({
  imports: [UserEntityModule, MangaEntitiesModule, SharedModule],
  controllers: [
    MangaController,
    ArtistController,
    GenreController,
    LanguageController,
    UserController,
  ],
  providers: [
    MangaService,
    ArtistService,
    GenreService,
    LanguageService,
    UserService,
    EventsGateway,
    UtilsService,
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
