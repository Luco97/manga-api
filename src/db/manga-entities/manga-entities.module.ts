import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ArtistEntity,
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
    ]),
  ],
  exports: [
    MangaEntityService,
    ArtistEntityService,
    LanguageEntityService,
    GenreEntityService,
  ],

  providers: [
    MangaEntityService,
    ArtistEntityService,
    LanguageEntityService,
    GenreEntityService,
  ],
})
export class MangaEntitiesModule {
  constructor() {}
}
