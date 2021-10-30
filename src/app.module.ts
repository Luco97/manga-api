import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MangaModule } from './manga/manga.module';

@Module({
  imports: [
    AuthModule,
    MangaModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {

}
