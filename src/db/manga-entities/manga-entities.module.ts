import { Module } from '@nestjs/common';
import { MangaService } from './service/manga.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MangaEntity } from './entity/manga.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MangaEntity])
  ],
  providers: [MangaService]
})
export class MangaEntitiesModule {}
