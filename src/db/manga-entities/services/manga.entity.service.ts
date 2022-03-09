import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, SelectQueryBuilder } from 'typeorm';
import { MangaEntity } from '@db/manga/entity';

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
  async findAll(
    relations: string[] = ['users', 'genres', 'languages', 'artists'],
  ): Promise<MangaEntity[]> {
    return await this.mangaRepository.find({ relations });
  }

  async findOne(
    id: number,
    relations: string[] = ['users', 'genres', 'languages', 'artists'],
  ): Promise<MangaEntity> {
    const data: MangaEntity = await this.mangaRepository.findOne(id, {
      relations,
    });
    if (!data) throw new NotFoundException(`No existe el manga con id=${id}`);
    return data;
  }

  async findBy(options: FindManyOptions<MangaEntity>): Promise<MangaEntity[]> {
    const data: MangaEntity[] = await this.mangaRepository.find(options);
    return data;
  }

  async create(manga: MangaEntity) {
    const data: MangaEntity = this.mangaRepository.create(manga);
    return await this.mangaRepository.save(data);
  }

  async delete(manga: MangaEntity) {
    const data = await this.findOne(manga.id, []);
    return await this.mangaRepository.remove(data);
  }

  private mangaQueryInner(
    queryBuilder: SelectQueryBuilder<MangaEntity>,
    relation: string,
  ): SelectQueryBuilder<MangaEntity> {
    return queryBuilder.innerJoinAndSelect(`manga.${relation}`, relation);
  }

  async getFavoritesById(
    user_id: number,
    relations: string[],
    take: number = 10,
    skip: number = 0,
  ): Promise<MangaEntity[]> {
    let data = this.mangaRepository
      .createQueryBuilder('manga')
      .innerJoin('manga.users', 'user', 'user.id = :user_id', { user_id });

    for (let i = 0; i < relations?.length; i++) {
      const element = relations[i];
      data = this.mangaQueryInner(data, element);
    }

    data = data
      .orderBy('manga.id')
      .take(take || 10)
      .skip(skip || 0);

    const readyQuery = await data.getMany();
    return readyQuery;
  }
}
