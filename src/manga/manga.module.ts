import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
//DB
import { DbConfigService } from '@shared/services';
import { MangaEntitiesModule } from '../db/manga-entities/manga-entities.module';
//Modules
import { SharedModule } from '../shared/shared.module';
//Guard
import { AuthGuard } from './guards/auth.guard';
import { LoginMiddleware } from './middleware/login.middleware';
//Controllers
import { MangaController } from './controller/manga.controller';
import { ArtistController } from './controller/artist.controller';
import { GenreController } from './controller/genre.controller';
import { LanguageController } from './controller/language.controller';
import { MangaService } from './services/manga.service';
import { ArtistService } from './services/artist.service';
import { GenreService } from './services/genre.service';
import { LanguageService } from './services/language.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [DbConfigService],
      useFactory: async ( dbService: DbConfigService): Promise<TypeOrmModuleOptions> => {
        return dbService.getTypeORMconfig();
      }
    }),
    MangaEntitiesModule,
    SharedModule
  ],
  controllers: [
    MangaController,
    ArtistController,
    GenreController,
    LanguageController
  ],
  providers: [
    LoginMiddleware,
    AuthGuard,
    MangaService,
    ArtistService,
    GenreService,
    LanguageService
  ]
})
export class MangaModule implements NestModule {
  configure( consumer: MiddlewareConsumer) {
    consumer
      .apply(LoginMiddleware)
      .forRoutes(MangaController)
  }
}
