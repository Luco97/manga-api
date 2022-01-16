import { LanguageEntity } from '@db/manga/entity';
import { LanguageEntityService } from '@db/manga/services';
import { Language, response } from '@interface/mangaResponses.interface';
import { Injectable, HttpStatus } from '@nestjs/common';

@Injectable()
export class LanguageService {

    constructor(
        private _languageService: LanguageEntityService
    ) {}

    async getAll(): Promise<{response: response, data?: Language[]}> {
        const data: LanguageEntity[] = await this._languageService.findAll([]);
        if(data.length) {
            return {
                response: {
                    status: HttpStatus.OK,
                    message: 'getAll idiomas'
                },
                data
            }
        }
        return {
            response: {
                status: HttpStatus.NO_CONTENT,
                message: 'Sin idiomas'
            }
        }
    }
}
