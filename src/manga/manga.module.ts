import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MangaController } from './controller/manga.controller';
import { AuthGuard } from './guards/auth.guard';
import { LoginMiddleware } from './middleware/login.middleware';
import { SharedModule } from '../shared/shared.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DbConfigService } from '@Shared/services/db-config.service';
import { MangaEntitiesModule } from '../db/manga-entities/manga-entities.module';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [DbConfigService],
      useFactory: async ( dbService: DbConfigService): Promise<TypeOrmModuleOptions> => {
        console.log('Conexion desde manga...');
        return await dbService.getTypeORMconfig();
      }
    }),
    MangaEntitiesModule
  ],
  controllers: [
    MangaController
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
