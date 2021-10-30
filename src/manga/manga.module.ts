import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MangaController } from './controller/manga.controller';
import { LoginMiddleware } from './middleware/login.middleware';

@Module({
  controllers: [
    MangaController
  ],
  providers: [
    LoginMiddleware
  ]
})
export class MangaModule implements NestModule {
  configure( consumer: MiddlewareConsumer) {
    consumer
      .apply(LoginMiddleware)
      .forRoutes(MangaController)
  }
}
