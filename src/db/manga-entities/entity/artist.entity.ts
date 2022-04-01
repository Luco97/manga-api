import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MangaEntity } from './manga.entity';

@Entity({
  name: 'ARTISTA',
})
export class ArtistEntity {
  constructor(
    name: string,
    artistic_name?: string,
    age?: number,
    country?: string,
    type?: string,
    description?: string,
  ) {
    this.name = name;
    this.artistic_name = artistic_name;
    this.age = age;
    this.country = country;
    this.type = type;
    this.description = description;
  }

  @PrimaryGeneratedColumn({
    name: 'ID',
  })
  id: number;

  @Column({
    name: 'NAME',
    type: 'varchar',
    length: 35,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'DESCRIPTION',
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  description: string;

  @Column({
    name: 'YO',
    type: 'int',
    nullable: true,
  })
  age: number;

  @Column({
    name: 'AKA',
    type: 'varchar',
    length: 35,
    nullable: true,
  })
  artistic_name: string;

  @Column({
    name: 'COUNTRY',
    type: 'varchar',
    length: 35,
    nullable: true,
  })
  country: string;

  @Column({
    name: 'CATEGORY',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  type: string;

  @CreateDateColumn({
    name: 'CREATED_AT',
    type: 'timestamp',
    select: false,
  })
  @Exclude()
  createDate: Date;

  @UpdateDateColumn({
    name: 'UPDATED_AT',
    type: 'timestamp',
    select: false,
  })
  @Exclude()
  updateDate: Date;

  @ManyToMany(() => MangaEntity, (manga) => manga.artists, {
    nullable: true,
  })
  @JoinTable({
    name: 'WRITER',
    joinColumn: {
      name: 'ARTIST_ID',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'MANGA_ID',
      referencedColumnName: 'id',
    },
  })
  mangas: MangaEntity[];
}
