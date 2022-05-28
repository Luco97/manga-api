import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ArtistEntity,
  CommentEntity,
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
      CommentEntity
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
