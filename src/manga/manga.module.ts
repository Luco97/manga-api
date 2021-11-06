import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MangaController } from './controller/manga.controller';
import { AuthGuard } from './guards/auth.guard';
import { LoginMiddleware } from './middleware/login.middleware';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    SharedModule
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
