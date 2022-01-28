
import { MangaEntity } from '@db/manga/entity';
import { MangaEntityService } from '@db/manga/services';
import { Manga, response } from '@interface/mangaResponses.interface';
import { createMangaDto, readMangaDto } from '@manga/dto';
import { Injectable, HttpStatus } from '@nestjs/common';

@Injectable()
export class MangaService {
    
    constructor(
        private _mangaService: MangaEntityService
    ) {}

    async getAll(): Promise<{response: response, data: Manga[]}> {
        const data: MangaEntity[] = await this._mangaService.findAll([]);
        if(data.length) {
            return {
                response: {
                    status: HttpStatus.OK,
                    message: 'getAll mangas'
                },
                data
            }
        }
        return {
            response: {
                status: HttpStatus.OK,
                message: 'Sin mangas'
            },
            data: []
        }
    }

    async getOne(id: number, relations: string[]): Promise<{response: response, data?: Manga}> {
        const data: MangaEntity[] = await this._mangaService.findBy({
            relations,
            where: {
                id
            }
        })
        if(data.length) {
            return {
                response: {
                    status: HttpStatus.OK,
                    message: 'getOne Manga'
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
    
    async create(createManga: createMangaDto): Promise<{response: response, data?: Manga}> {
        const mangas: MangaEntity[] = await this._mangaService.findBy({
            where: {
                title: createManga.title.toLocaleLowerCase()
            }
        });
        if(!mangas.length) {
            const newManga = new MangaEntity(createManga.title.toLocaleLowerCase(), createManga.chapters, createManga.genres, createManga.artists, createManga.languages);
            const data: MangaEntity = await this._mangaService.create(newManga);
            return {
                response: {
                    status: HttpStatus.CREATED,
                    message: 'Manga creado'
                },
                data
            }
        }
        return {
            response: {
                status: HttpStatus.CONFLICT,
                message: 'Ya existe un manga con ese titulo'
            },
            data: mangas.pop()
        }
    }

    async delete(id: number): Promise<{response: response, data?: Manga}> {
        const data: {response: response, data?: Manga} = await this.getOne(id, []);
        if(data?.data) {
            const manga = await this._mangaService.delete(data.data as MangaEntity);
            return {
                response: {
                    status: HttpStatus.OK,
                    message: 'Manga eliminado'
                },
                data: data.data
            }
        }
        return {
            response: {
                status: HttpStatus.NOT_FOUND,
                message: `No se encuentra un manga con id = '${id}'`
            }
        }
    }
}
