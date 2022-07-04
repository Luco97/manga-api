import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { ArtistEntity, MangaEntity } from '@db/manga/entity';

@Injectable()
export class ArtistEntityService {
  constructor(
    @InjectRepository(ArtistEntity)
    private artistRepository: Repository<ArtistEntity>,
  ) {}

  async findAll(relations: string[] = ['mangas']): Promise<ArtistEntity[]> {
    const data = await this.artistRepository.find({ relations });
    return data;
  }

  async findOne(
    id: number,
    relations: string[] = ['mangas'],
  ): Promise<ArtistEntity> {
    // const data = await this.artistRepository.findOne(id, {relations});
    return this.artistRepository
      .createQueryBuilder('artist')
      .loadRelationCountAndMap(
        'artist.count',
        'artist.mangas',
        'asd',
        (subQuery) => {
          return subQuery.orderBy('cnt', 'ASC');
        },
      )
      .where('artist.id = :id', { id })
      .addOrderBy('artist.id')
      .getOne();
  }

  async findBy(
    options: FindManyOptions<ArtistEntity>,
  ): Promise<ArtistEntity[]> {
    return this.artistRepository.find(options);
  }

  async create(artist: ArtistEntity) {
    const newArtist = this.artistRepository.create(artist);
    return this.artistRepository.save(newArtist);
  }

  async delete(artist: ArtistEntity) {
    const data = await this.findOne(artist.id, []);
    return this.artistRepository.remove(data);
  }
}
