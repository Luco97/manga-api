import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { GenreEntity, MangaEntity } from '@db/manga/entity';

@Injectable()
export class GenreService {
    
    constructor(
        @InjectRepository(GenreEntity)
        public genreRepository: Repository<GenreEntity>
    ) {}

    async findAll(relations: string[] = ['mangas']): Promise<GenreEntity[]> {
        const data: GenreEntity[] = await this.genreRepository.find({relations});
        return data;
    }

    async findOne(id: number, relations: string[] = ['mangas']): Promise<GenreEntity> {
        const data: GenreEntity = await this.genreRepository.findOne(id, {relations});
        if(!data) throw new NotFoundException(`No se encuentra el genero id=${id}`);
        return data;
    }

    async findBy(options: FindOneOptions<GenreEntity>): Promise<GenreEntity[]> {
        const data = await this.genreRepository.find(options);
        return data;
    }

    async create( genre: GenreEntity) {
        return await this.genreRepository.save({...genre} as GenreEntity);
    }

    async delete( genre: GenreEntity) {
        const data = await this.findOne(genre.id, []);
        return await this.genreRepository.remove(data);
    }

    async createCategory( manga: MangaEntity, genre: GenreEntity) {
        const genero = await this.findOne( genre.id);
        genero.mangas.push({...manga});
        return await this.genreRepository.save(genero);
    }
}
