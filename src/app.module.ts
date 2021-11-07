import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MangaModule } from './manga/manga.module';
// import { UserModule } from './db/user/user.module';
// import { MangaEntitiesModule } from './db/manga-entities/manga-entities.module';

@Module({
  imports: [
    AuthModule,
    MangaModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    // UserModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {
  
}
