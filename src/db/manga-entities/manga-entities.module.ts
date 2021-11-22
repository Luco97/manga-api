import { Module } from '@nestjs/common';
import { MangaService } from './services/manga.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MangaEntity } from './entity/manga.entity';
import { ArtistService } from './services/artist.service';
import { LanguageService } from './services/language.service';
import { GenreService } from './services/genre.service';
import { ArtistEntity } from './entity/artist.entity';
import { LanguageEntity } from './entity/language.entity';
import { GenreEntity } from './entity/genre.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MangaEntity, ArtistEntity, LanguageEntity, GenreEntity])
  ],
  providers: [MangaService, ArtistService, LanguageService, GenreService,]
})
export class MangaEntitiesModule {}
