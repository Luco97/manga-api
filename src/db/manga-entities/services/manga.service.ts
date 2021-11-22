import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


import { MangaEntity } from '../entity/manga.entity';
import { GenreEntity } from '../entity/genre.entity';
import { ArtistEntity } from '../entity/artist.entity';
import { LanguageEntity } from '../entity/language.entity';

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

    async createCategory( manga: MangaEntity, genre: GenreEntity) {
        const comic = await this.findOne(manga.id);
        comic.genres.push({...genre} as GenreEntity);
        return await this.mangaRepository.save(comic);
    }

    async createWriter( manga: MangaEntity, artist: ArtistEntity) {
        const comic: MangaEntity = await this.findOne(manga.id);
        comic.artists.push( {...artist} as ArtistEntity);
        return await this.mangaRepository.save(comic);
    }

    async createTranslate( manga: MangaEntity, language: LanguageEntity) {
        const comic: MangaEntity = await this.findOne(manga.id);
        comic.languages.push( {...language} as LanguageEntity);
        return await this.mangaRepository.save(comic);
    }
}
