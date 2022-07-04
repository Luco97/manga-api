import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { GenreEntity, MangaEntity } from '@db/manga/entity';

@Injectable()
export class GenreEntityService {
  constructor(
    @InjectRepository(GenreEntity)
    public genreRepository: Repository<GenreEntity>,
  ) {}

  async findAll(relations: string[] = ['mangas']): Promise<GenreEntity[]> {
    const data: GenreEntity[] = await this.genreRepository.find({ relations });
    return data;
  }

  async findOne(id: number): Promise<GenreEntity> {
    return this.genreRepository
      .createQueryBuilder('genre')
      .where('genre.id = :id', { id })
      .loadRelationCountAndMap('genre.count', 'genre.mangas', 'mangos', (qb) =>
        qb.orderBy('cnt'),
      )
      .getOne();
  }

  async findBy(options: FindOneOptions<GenreEntity>): Promise<GenreEntity[]> {
    const data = await this.genreRepository.find(options);
    return data;
  }

  async create(genre: GenreEntity) {
    const data = this.genreRepository.create(genre);
    return await this.genreRepository.save(data);
  }

  async delete(genre: GenreEntity) {
    const data = await this.findOne(genre.id);
    return await this.genreRepository.remove(data);
  }
}
