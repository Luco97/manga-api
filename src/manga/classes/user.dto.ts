import { Manga, User } from '@interface/mangaResponses.interface';
import { ArrayMinSize, ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, Length, Max, Min } from "class-validator";

export class setFavorite {
    @IsNotEmpty({
        message: `Falta definir la propiedad 'manga'`
    })
    manga: Manga;
}
