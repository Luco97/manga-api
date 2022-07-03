import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { ArtistEntity, MangaEntity } from '@db/manga/entity';


@Injectable()
export class ArtistEntityService {
    constructor(
        @InjectRepository(ArtistEntity)
        private artistRepository: Repository<ArtistEntity>
    ) {
        
       /*  this.findOne(4).then( (value) => {
            const a: ArtistEntity = value;
            this.delete(a);
        });
        this.findAll();
        this.findOne(6); */
        /* this.findOne(3).then( (value) => {
            const a: ArtistEntity = value;
            this.delete(a);
        }); */
    }

    async findAll(relations: string[] = ['mangas']): Promise<ArtistEntity[]> {
        const data = await this.artistRepository.find({relations});
        return data;
    }

    async findOne(id: number, relations: string[] = ['mangas']): Promise<ArtistEntity> {
        const data = await this.artistRepository.findOne(id, {relations});
        if(!data) throw new NotFoundException(`No puede encontrar un artista con id=${id}`);
        return data;
    }

    async findBy(options: FindManyOptions<ArtistEntity>): Promise<ArtistEntity[]> {
        const data = await this.artistRepository.find(options);
        return data;
    }

    async create( artist: ArtistEntity) {
        /* const data = this.artistRepository.create({...artist} as ArtistEntity) */
        const newArtist = this.artistRepository.create(artist);
        return await this.artistRepository.save(newArtist);
    }

    async delete(artist: ArtistEntity) {
        const data = await this.findOne(artist.id, []);
        return await this.artistRepository.remove(data);
    }
}
