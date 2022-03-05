import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
//DB
import { DbConfigService } from '@shared/services';
import { MangaEntitiesModule } from '../db/manga-entities/manga-entities.module';
//Modules
import { SharedModule } from '../shared/shared.module';
//Guard
import { AuthGuard } from './guards/auth.guard';
import { PayloadMiddleware } from './middleware/payload.middleware';
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
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [DbConfigService],
      useFactory: async ( dbService: DbConfigService): Promise<TypeOrmModuleOptions> => {
        return dbService.getTypeORMconfig();
      }
    }),
    UserEntityModule,
    MangaEntitiesModule,
    SharedModule
  ],
  controllers: [
    MangaController,
    ArtistController,
    GenreController,
    LanguageController,
    UserController
  ],
  providers: [
    MangaService,
    ArtistService,
    GenreService,
    LanguageService,
    UserService,
    EventsGateway,
    UtilsService
  ]
})
export class MangaModule implements NestModule {
  configure( consumer: MiddlewareConsumer) {
    consumer
      .apply(PayloadMiddleware)
      .forRoutes({
        path: 'user/favorites',
        method: RequestMethod.POST
      },
      {
        path: 'user/favorites',
        method: RequestMethod.PUT
      })
  }
}
