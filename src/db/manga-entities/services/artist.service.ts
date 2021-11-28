import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtistEntity, MangaEntity } from '@mangaDB/entity';


@Injectable()
export class ArtistService {
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

    async findAll(): Promise<ArtistEntity[]> {
        const data = await this.artistRepository.find();
        return data;
    }

    async findOne(id: number): Promise<ArtistEntity> {
        const data = await this.artistRepository.findOne(id);
        if(!data) throw new NotFoundException('No puede encontrar un artista');
        console.log(data)
        return data;
    }

    async create( artist: ArtistEntity) {
        /* const data = this.artistRepository.create({...artist} as ArtistEntity) */
        return await this.artistRepository.save({...artist} as ArtistEntity);
    }

    async delete( artist: ArtistEntity) {
        const data = await this.findOne(artist.id);
        return await this.artistRepository.remove(data);
    }

    async createWriter( manga: MangaEntity, artist: ArtistEntity) {
        const artista = await this.findOne(artist.id);
        artista.mangas.push({...manga} as MangaEntity);
        return await this.artistRepository.save(artista);
    }
}
