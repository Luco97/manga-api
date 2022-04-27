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

  async updateLikes(id: number, updateState: number): Promise<boolean> {
    const data: MangaEntity[] = await this.mangaRepository.find({
      id,
    });
    if (data.length) {
      const manga: MangaEntity = data.pop();
      manga.likes += updateState;
      const result = await this.mangaRepository.save(manga);
      return result ? true : false;
    }
    return false;
  }

  private mangaQueryInnerAndJoin(
    queryBuilder: SelectQueryBuilder<MangaEntity>,
    relation: string,
  ): SelectQueryBuilder<MangaEntity> {
    return queryBuilder.innerJoinAndSelect(`manga.${relation}`, relation);
  }

  private mangaQueryInner(
    queryBuilder: SelectQueryBuilder<MangaEntity>,
    relation: string,
  ): SelectQueryBuilder<MangaEntity> {
    return queryBuilder.innerJoin(`manga.${relation}`, `${relation}-Inner`);
  }

  async findAll(options: {
    relations: string[];
    take: number;
    skip: number;
    search_keyword?: string;
  }): Promise<MangaEntity[]> {
    const { relations, skip, take, search_keyword } = options;

    console.log('---> ', relations);
    console.log('---> all ---> ', mangaRelations);

    let data = this.mangaRepository.createQueryBuilder('manga');

    for (let i = 0; i < relations?.length; i++) {
      const element = relations[i];
      data = this.mangaQueryInnerAndJoin(data, element);
    }

    if (search_keyword) {
      mangaRelations.forEach((element) => {
        data = this.mangaQueryInner(data, element);
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

      // data.where(`manga.title like :search_keyword`, {
      //   search_keyword: search_keyword || '%%',
      // });
    }

    data = data
      .orderBy('manga.id', 'ASC')
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
      data = this.mangaQueryInnerAndJoin(data, element);
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
  }): Promise<MangaEntity[]> {
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
      data = this.mangaQueryInnerAndJoin(data, element);
    }

    data = data
      .orderBy('manga.id', 'DESC')
      .take(take || 10)
      .skip(skip * take || 0);

    const readyQuery = await data.getMany();
    return readyQuery;
  }
}
