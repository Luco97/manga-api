import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistEntity, GenreEntity, LanguageEntity, MangaEntity } from './entity';
import { ArtistService, GenreService, LanguageService, MangaService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([MangaEntity, ArtistEntity, LanguageEntity, GenreEntity])
  ],
  providers: [MangaService, ArtistService, LanguageService, GenreService,]
})
export class MangaEntitiesModule {}
