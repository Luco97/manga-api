import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ArtistEntity,
  GenreEntity,
  LanguageEntity,
  MangaEntity,
} from '@mangaDB/entity';
/* import { MangaEntity } from '../entity/manga.entity';
import { GenreEntity } from '../entity/genre.entity';
import { ArtistEntity } from '../entity/artist.entity';
import { LanguageEntity } from '../entity/language.entity'; */

import { UserEntity } from '@userDB/entity';
/* import { UserEntity } from '../../user-entity/entity/user.entity'; */


@Injectable()
export class MangaService {
    constructor(
        @InjectRepository(MangaEntity) 
        private mangaRepository: Repository<MangaEntity>
    ) {}

    async findAll(): Promise<MangaEntity[]> {
        return await this.mangaRepository.find();
    }

    /* async findOne(id: number): Promise<MangaEntity> {
        
        const data = await this.mangaRepository.findOne(id)
        return data;
    } */

    async findOne( id: number): Promise<MangaEntity> {
        const data: MangaEntity = await this.mangaRepository.findOne(id);
        if(!data) throw new NotFoundException('No existe el manga');
        return data;
    }

    async create( manga: MangaEntity) {
        return await this.mangaRepository.save( {...manga} as MangaEntity);
    }

    async delete( manga: MangaEntity) {
        const data = await this.findOne( manga.id);
        return await this.mangaRepository.remove(data);
    }

    async addFavorite( manga: MangaEntity, user: UserEntity) {
        const comic: MangaEntity = await this.findOne(manga.id);
        comic.users.push( {...user} as UserEntity);
        return await this.mangaRepository.save(comic);
    }

    async subtract( manga: MangaEntity, user: UserEntity) {
        const comic: MangaEntity = await this.findOne(manga.id);
        const value: number = comic.users.indexOf(user);
        if(value >= 0) {
            comic.users.splice(value,1);
            return await this.mangaRepository.save(comic);
        }
        return new NotFoundException(`El usuario con id=${user.id} y username='${user.username}' no existe en los favoritos del manga con id=${manga.id} y titulo='${manga.title}'`)
    }

    async addCategory( manga: MangaEntity, genre: GenreEntity) {
        const comic = await this.findOne(manga.id);
        comic.genres.push({...genre} as GenreEntity);
        return await this.mangaRepository.save(comic);
    }

    async addWriter( manga: MangaEntity, artist: ArtistEntity) {
        const comic: MangaEntity = await this.findOne(manga.id);
        comic.artists.push( {...artist} as ArtistEntity);
        return await this.mangaRepository.save(comic);
    }

    async addTranslate( manga: MangaEntity, language: LanguageEntity) {
        const comic: MangaEntity = await this.findOne(manga.id);
        comic.languages.push( {...language} as LanguageEntity);
        return await this.mangaRepository.save(comic);
    }
}
