import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import {
  ArtistEntity,
  GenreEntity,
  LanguageEntity,
  MangaEntity,
} from '@db/manga/entity';
/* import { MangaEntity } from '../entity/manga.entity';
import { GenreEntity } from '../entity/genre.entity';
import { ArtistEntity } from '../entity/artist.entity';
import { LanguageEntity } from '../entity/language.entity'; */

import { UserEntity } from '@userDB/entity';
/* import { UserEntity } from '../../user-entity/entity/user.entity'; */

@Injectable()
export class MangaEntityService {
  constructor(
    @InjectRepository(MangaEntity)
    private mangaRepository: Repository<MangaEntity>,
  ) {}

  /**
   * Encuentra todos los mangas en BD.
   * @param {string[]} relations - Vector con relaciones, [ ] no toma ninguna tabla relacional.
   */
  async findAll(relations: string[] = ['users', 'genres', 'languages', 'artists']): Promise<MangaEntity[]> {
    return await this.mangaRepository.find({ relations });
  }

  async findOne(id: number, relations: string[] = ['users', 'genres', 'languages', 'artists']): Promise<MangaEntity> {
    const data: MangaEntity = await this.mangaRepository.findOne(id, {relations});
    if (!data) throw new NotFoundException(`No existe el manga con id=${id}`);
    return data;
  }

  async findBy(options: FindOneOptions<MangaEntity>): Promise<MangaEntity[]> {
    const data: MangaEntity[] = await this.mangaRepository.find(options);
    return data;
  }

  async create(manga: MangaEntity) {
    return await this.mangaRepository.save({ ...manga } as MangaEntity);
  }

  async delete(manga: MangaEntity) {
    const data = await this.findOne(manga.id,[]);
    return await this.mangaRepository.remove(data);
  }

  async addFavorite(manga: MangaEntity, user: UserEntity) {
    const comic: MangaEntity = await this.findOne(manga.id, ['users']);
    /* const comic: MangaEntity = await this.mangaRepository.findOne(manga.id, {}); */
    comic.users.push({ ...user } as UserEntity);
    return await this.mangaRepository.save(comic);
  }

  async subtractFavorite(manga: MangaEntity, user: UserEntity) {
    const comic: MangaEntity = await this.findOne(manga.id, ['users']);
    const value: number = comic.users.indexOf(user);
    if (value >= 0) {
      comic.users.splice(value, 1);
      return await this.mangaRepository.save(comic);
    }
    return new NotFoundException(
      `El usuario con id=${user.id} y username='${user.username}' no existe en los favoritos del manga con id=${manga.id} y titulo='${manga.title}'`,
    );
  }

  async addCategory(manga: MangaEntity, genre: GenreEntity) {
    const comic = await this.findOne(manga.id, ['genres']);
    comic.genres.push({ ...genre } as GenreEntity);
    return await this.mangaRepository.save(comic);
  }

  async addWriter(manga: MangaEntity, artist: ArtistEntity) {
    const comic: MangaEntity = await this.findOne(manga.id, ['artists']);
    comic.artists.push({ ...artist } as ArtistEntity);
    return await this.mangaRepository.save(comic);
  }

  async addTranslate(manga: MangaEntity, language: LanguageEntity) {
    const comic: MangaEntity = await this.findOne(manga.id, ['languages']);
    comic.languages.push({ ...language } as LanguageEntity);
    return await this.mangaRepository.save(comic);
  }
}
