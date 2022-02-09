import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  Entity,
  UpdateDateColumn,
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
    chapters: number,
    genres: GenreEntity[],
    artists: ArtistEntity[],
    languages: LanguageEntity[],
  ) {
      this.title      = title;
      this.chapters   = chapters;
      this.genres     = genres;
      this.artists    = artists;
      this.languages  = languages;
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
    name: 'CHAPTERS',
    type: 'int',
    update: true,
    nullable: false,
  })
  chapters: number;

  @CreateDateColumn({
    name: 'CREATED_AT',
    type: 'timestamp',
    select: false
  })
  created_at: Date;

  @UpdateDateColumn({
    name: 'UPDATED_AT',
    type: 'timestamp',
    select: false
  })
  updated_at: Date;

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

  @ManyToMany(() => UserEntity, user => user.mangas,{
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
