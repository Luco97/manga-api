import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenreEntity } from '../entity/genre.entity';
import { MangaEntity } from '../entity/manga.entity';

@Injectable()
export class GenreService {
    
    constructor(
        @InjectRepository(GenreEntity)
        private genreRepository: Repository<GenreEntity>
    ) {}

    async findAll(): Promise<GenreEntity[]> {
        const data: GenreEntity[] = await this.genreRepository.find();
        /* this.genreRepository.find().then(
            value => {
                const data: GenreEntity[] = value;
                return data;
            }
        ) */
        return data;
    }

    async findOne(id: number): Promise<GenreEntity> {
        const data: GenreEntity = await this.genreRepository.findOne(id);
        if(!data) throw new NotFoundException('No se encuentra el genero');
        return data;
    }

    async create( genre: GenreEntity) {
        return await this.genreRepository.save({...genre} as GenreEntity);
    }

    async delete( genre: GenreEntity) {
        const data = await this.findOne( genre.id);
        return await this.genreRepository.remove(data);
    }

    async createCategory( manga: MangaEntity, genre: GenreEntity) {
        const genero = await this.findOne( genre.id);
        genero.mangas.push({...manga} as MangaEntity);
        return await this.genreRepository.save(genero);
    }
}
