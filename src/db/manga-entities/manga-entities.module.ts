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
import { CommentEntityService } from './services/comment.entity.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MangaEntity,
      ArtistEntity,
      LanguageEntity,
      GenreEntity,
      CommentEntity,
    ]),
  ],
  exports: [
    MangaEntityService,
    ArtistEntityService,
    LanguageEntityService,
    GenreEntityService,
    CommentEntityService,
  ],

  providers: [
    MangaEntityService,
    ArtistEntityService,
    LanguageEntityService,
    GenreEntityService,
    CommentEntityService,
  ],
})
export class MangaEntitiesModule {
  constructor() {}
}
