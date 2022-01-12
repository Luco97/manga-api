import { Injectable, HttpStatus } from '@nestjs/common';
import { GenreService as genreService } from '@db/manga/services';
import { Genre, response } from '@interface/mangaResponses.interface';
import { GenreEntity } from '@db/manga/entity';
import { createGenreDto } from '@manga/dto';

@Injectable()
export class GenreService {

    constructor(
        private _genreService: genreService
    ) {}

    async getAll(): Promise<{response: response, data?: GenreEntity[]}> {
        const data: GenreEntity[] = await this._genreService.findAll([]);
        if(data.length) {
            return {
                response:{
                    status: HttpStatus.OK,
                    message: 'getAll generos'
                },
                data
            }
        }
        return {
            response: {
                status: HttpStatus.NO_CONTENT,
                message: 'Sin generos'
            }
        }
    }

    async getOne(id: number, relations: string[]): Promise<{response: response, data?: Genre}> {
        const data: GenreEntity[] = await this._genreService.findBy({
            relations,
            where: {
                id
            }
        });
        if(data.length) {
            return {
                response: {
                    status: HttpStatus.OK,
                    message: 'getOne generos'
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

    async create(createGenre: createGenreDto): Promise<{response: response, data?: Genre}> {
        const genres: GenreEntity[] = await this._genreService.findBy({
            where: {
                tag: createGenre.tag.toLocaleLowerCase()
            }
        })
        if(!genres.length) {
            const newGenre: GenreEntity = new GenreEntity(createGenre.tag.toLocaleLowerCase());
            const data = await this._genreService.create(newGenre);
            return {
                response: {
                    status: HttpStatus.CREATED,
                    message: 'Genero creado'
                },
                data
            }
        }
        return {
            response: {
                status: HttpStatus.CONFLICT,
                message: 'Ya existe un genero con ese tag'
            },
            data: genres.pop()
        }
    }
}
