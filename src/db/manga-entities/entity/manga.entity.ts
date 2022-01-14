import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  Entity,
} from 'typeorm';
import { LanguageEntity } from './language.entity';
import { GenreEntity } from './genre.entity';
import { ArtistEntity } from './artist.entity';
import { UserEntity } from '@userDB/entity';

@Entity({
  name: 'MANGA',
  orderBy: {
    CREATED_AT: 'DESC',
  },
})
export class MangaEntity {
  constructor(
    title: string,
    number_or_pages: number,
    genres: GenreEntity[],
    artists: ArtistEntity[],
    languages: LanguageEntity[],
  ) {
      this.title =           title;
      this.number_of_pages = number_or_pages;
      this.genres =          genres;
      this.artists =         artists;
      this.languages =       languages;
  }

  @PrimaryGeneratedColumn({
    name: 'ID',
  })
  id: number;

  @Column({
    name: 'TITLE',
    type: 'varchar',
    length: 150,
    update: false,
    nullable: false,
  })
  title: string;

  @Column({
    name: 'NUMBER_OF_PAGES',
    type: 'int',
    update: false,
    nullable: false,
  })
  number_of_pages: number;

  @CreateDateColumn({
    name: 'CREATED_AT',
    type: 'timestamp',
    select: false
  })
  created_at: Date;

  @ManyToMany(() => ArtistEntity, (artist) => artist.mangas, {
    nullable: false,
  })
  artists: ArtistEntity[];

  @ManyToMany(() => LanguageEntity, (language) => language.mangas, {
    nullable: false,
  })
  languages: LanguageEntity[];

  @ManyToMany(() => GenreEntity, (genre) => genre.mangas, {
    nullable: false,
  })
  genres: GenreEntity[];

  @ManyToMany(() => UserEntity, {
    nullable: true,
  })
  @JoinTable({
    name: 'FAVORITES',
    joinColumn: {
      name: 'MANGA_ID',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'USER_ID',
      referencedColumnName: 'id',
    },
  })
  users: UserEntity[];
}
