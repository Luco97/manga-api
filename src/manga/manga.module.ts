import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
//DB
import { DbConfigService } from '@Shared/services/db-config.service';
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

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [DbConfigService],
      useFactory: async ( dbService: DbConfigService): Promise<TypeOrmModuleOptions> => {
        return dbService.getTypeORMconfig();
      }
    }),
    MangaEntitiesModule
  ],
  controllers: [
    MangaController,
    ArtistController,
    GenreController,
    LanguageController
  ],
  providers: [
    LoginMiddleware,
    AuthGuard
  ]
})
export class MangaModule implements NestModule {
  configure( consumer: MiddlewareConsumer) {
    consumer
      .apply(LoginMiddleware)
      .forRoutes(MangaController)
  }
}
