import { LanguageEntityService } from '@db/manga/services';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LanguageService {

    constructor(
        private _languageService: LanguageEntityService
    ) {}
}
