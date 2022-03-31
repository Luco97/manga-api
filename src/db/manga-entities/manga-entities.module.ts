import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ArtistEntity,
  FavoriteEntity,
  GenreEntity,
  LanguageEntity,
  MangaEntity,
} from './entity';
import {
  ArtistEntityService,
  GenreEntityService,
  LanguageEntityService,
  MangaEntityService,
} from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MangaEntity,
      ArtistEntity,
      LanguageEntity,
      GenreEntity,
      FavoriteEntity
    ]),
  ],
  exports: [MangaEntityService, ArtistEntityService, LanguageEntityService, GenreEntityService],

  providers: [MangaEntityService, ArtistEntityService, LanguageEntityService, GenreEntityService],
})
export class MangaEntitiesModule {
  constructor() {}
}
