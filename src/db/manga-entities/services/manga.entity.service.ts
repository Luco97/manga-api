import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, SelectQueryBuilder } from 'typeorm';
import { MangaEntity } from '@db/manga/entity';
import { searchByColumn, mangaRelations } from '../const/relations';

@Injectable()
export class MangaEntityService {
  constructor(
    @InjectRepository(MangaEntity)
    private mangaRepository: Repository<MangaEntity>,
  ) {}

  async findOne(id: number, relations: string[] = []): Promise<MangaEntity> {
    const QB = this.mangaRepository.createQueryBuilder('manga');

    relations.forEach((relation) => {
      this.mangaQueryLeftAndSelect(QB, relation);
    });

    return QB.where('manga.id = :id', { id })
      .loadRelationCountAndMap(
        'manga.favorites',
        'manga.users',
        'users',
        (subQuery) => subQuery.orderBy('"cnt"'),
      )
      .getOne();
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
    const data = await this.findOne(manga.id);
    return await this.mangaRepository.remove(data);
  }

  private mangaQueryLeftAndSelect(
    queryBuilder: SelectQueryBuilder<MangaEntity>,
    relation: string,
  ): SelectQueryBuilder<MangaEntity> {
    return queryBuilder.leftJoinAndSelect(`manga.${relation}`, relation);
  }

  private mangaQueryLeft(
    queryBuilder: SelectQueryBuilder<MangaEntity>,
    relation: string,
  ): SelectQueryBuilder<MangaEntity> {
    return queryBuilder.leftJoin(`manga.${relation}`, `${relation}-Inner`);
  }

  async findAll(options: {
    relations: string[];
    take: number;
    skip: number;
    search_keyword?: string;
    property: string;
    order: 'ASC' | 'DESC';
  }): Promise<MangaEntity[]> {
    const { relations, skip, take, search_keyword, property, order } = options;

    let data = this.mangaRepository.createQueryBuilder('manga');

    for (let i = 0; i < relations?.length; i++) {
      const element = relations[i];
      data = this.mangaQueryLeftAndSelect(data, element);
      data.loadRelationCountAndMap(
        `${element}.count`,
        `${element}.mangas`,
        '',
        (subQuery) => subQuery.orderBy('cnt'),
      );
    }

    if (search_keyword) {
      mangaRelations.forEach((element) => {
        data = this.mangaQueryLeft(data, element);
      });
      mangaRelations.forEach((element) => {
        data.orWhere(
          `${element}-Inner.${searchByColumn[element]} like :keyword`,
          {
            keyword: `${search_keyword}`,
          },
        );
      });
      data.orWhere(`manga.title like :search_keyword`, {
        search_keyword: search_keyword || '%%',
      });
    }

    data = data
      .loadRelationCountAndMap(
        'manga.likes',
        'manga.users',
        'usuarios',
        (subQuery) => subQuery.orderBy('cnt'),
      )
      .orderBy(`manga.${property}`, order)
      .take(take || 10)
      .skip(skip * take || 0);

    const readyQuery = await data.getMany();
    return readyQuery;
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
      data = this.mangaQueryLeftAndSelect(data, element);
    }

    data = data
      .orderBy('manga.id')
      .take(take || 10)
      .skip(skip * take || 0);

    const readyQuery = await data.getMany();
    return readyQuery;
  }

  async getMangasById(options: {
    relations: string[];
    take: number;
    skip: number;
    relation_name: string;
    relation_id: number;
  }): Promise<[MangaEntity[], number]> {
    const { relations, skip, take, relation_name, relation_id } = options;

    let data = this.mangaRepository
      .createQueryBuilder('manga')
      .innerJoin(
        `manga.${relation_name}`,
        'entity_alias',
        'entity_alias.id = :relation_id',
        { relation_id },
      );

    for (let i = 0; i < relations?.length; i++) {
      const element = relations[i];
      data = this.mangaQueryLeftAndSelect(data, element);
    }

    data = data
      .loadRelationCountAndMap(
        'manga.likes',
        'manga.users',
        'usuarios',
        (subQuery) => subQuery.orderBy('cnt'),
      )
      .orderBy('manga.id', 'DESC')
      .take(take || 10)
      .skip(skip * take || 0);

    const readyQuery = await data.getManyAndCount();
    return readyQuery;
  }
}
