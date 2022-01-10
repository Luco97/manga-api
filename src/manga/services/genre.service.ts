import { Injectable, HttpStatus } from '@nestjs/common';
import { GenreService as genreService } from '@db/manga/services';
import { Genre, response } from '@interface/mangaResponses.interface';
import { GenreEntity } from '@db/manga/entity';

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
}
