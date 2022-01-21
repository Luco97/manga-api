
import { MangaEntity } from '@db/manga/entity';
import { MangaEntityService } from '@db/manga/services';
import { Manga, response } from '@interface/mangaResponses.interface';
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
}
