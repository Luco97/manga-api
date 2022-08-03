import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { DbConfigService } from '@shared/services';
import { MangaModule } from './manga/manga.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [DbConfigService],
      useFactory: async (
        dbService: DbConfigService,
      ): Promise<TypeOrmModuleOptions> => {
        return {
          ...dbService.getTypeORMconfig(),
          retryDelay: 3000,
        };
      },
    }),
    AuthModule,
    MangaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
