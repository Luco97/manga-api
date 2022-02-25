import { Manga } from '@interface/mangaResponses.interface';
import { IsNotEmpty } from "class-validator";
import { Pagination } from './utils.dto';

export class setFavorite {
    @IsNotEmpty({
        message: `Falta definir la propiedad 'manga'`
    })
    manga: Manga;
}

export class getFavorite extends Pagination {
    user: {
        id: number;
        username: string;
    }
}
