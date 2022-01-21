import { Injectable, HttpStatus } from '@nestjs/common';
import { ArtistEntityService } from '@db/manga/services';
import { response, Artist } from '@interface/mangaResponses.interface';
import { ArtistEntity } from '@db/manga/entity';
import { createArtistDto, updateArtistsDto } from '@manga/dto';

@Injectable()
export class ArtistService {

    constructor(
        private _artistService: ArtistEntityService
    ) {}
    
    async getAll(): Promise<{response: response, data: Artist[]}> {
        const data: ArtistEntity[] = await this._artistService.findAll([])
        if(data.length) {
            return {
                response:{
                    status: HttpStatus.OK,
                    message: 'getAll artistas'
                },
                data: data
            }
        }
        return {
            response: {
                status: HttpStatus.OK,
                message: 'Sin artistas'
            },
            data: []
        }
    }

    async getOne(id: number, relations: string[]): Promise<{response: response, data?: Artist}> {
        const data: ArtistEntity[] = await this._artistService.findBy({
            relations,
            where: {
                id
            }
        });
        if(data.length) {
            return {
                response:{
                    status: HttpStatus.OK,
                    message: 'getOne artistas'
                },
                data: data.pop()
            }
        }
        return {
            response: {
                status: HttpStatus.NOT_FOUND,
                message: 'No encontrado'
            }
        }
    }

    async create(createArtist: createArtistDto): Promise<{response: response, data?: Artist}> {
        const artists: ArtistEntity[] = await this._artistService.findBy({
            where:{
                name: createArtist.name.toLocaleLowerCase()
            }
        });
        if(!artists.length) {
            const newArtist: ArtistEntity = new ArtistEntity(
                createArtist.name.toLocaleLowerCase(),
                createArtist?.seudoName,
                createArtist?.age,
                createArtist?.country,
                createArtist?.type,
                createArtist?.description
            );
            const data = await this._artistService.create(newArtist);
            return {
                response: {
                    status: HttpStatus.CREATED,
                    message: 'Artista creado'
                },
                data
            }
        }
        return {
            response:{
                status: HttpStatus.CONFLICT,
                message: 'Ya existe un artista con ese nombre'
            },
            data: artists.pop()
        }
    }

    async update( id: number, updateArtist: updateArtistsDto): Promise <{ response: response, data?: Artist}> {
        const artists: ArtistEntity[] = await this._artistService.findBy({
            where: {
                id
            }
        });
        
        if(artists.length) {
            const artist: ArtistEntity = artists.pop();
            updateArtist.age ?          artist.age           = updateArtist.age : 0 ;
            updateArtist.country ?      artist.country       = updateArtist.country: 0 ;
            updateArtist.description ?  artist.description   = updateArtist.description : 0 ;
            updateArtist.seudoName ?    artist.artistic_name = updateArtist.seudoName : 0 ;
            updateArtist.type ?         artist.type          = updateArtist.type : 0 ;
            
            await this._artistService.create(artist);
            
            return {
                response: {
                    status: HttpStatus.OK,
                    message: `Artista ${artist.name} actualizado`
                },
                data: artist
            }
        }

        return {
            response: {
                status: HttpStatus.NOT_FOUND,
                message: 'Artista no encontrado'
            }
        }
    }
    
}
