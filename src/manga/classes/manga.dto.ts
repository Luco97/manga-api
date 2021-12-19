import { GenreEntity, ArtistEntity, LanguageEntity } from '@mangaDB/entity';
import { ArrayMinSize, IsArray, IsNotEmpty, Length, Max, Min } from "class-validator";

export class createMangaDto {
    @IsNotEmpty({
        message: `Falta definir la propiedad 'title'`
    })
    @Length( 5, 150, {
        message: 'Esta bajo el minimo/Supera el maximo de caracteres'
    })
    title: string;

    @IsNotEmpty({
        message: `Falta definir la propiedad 'numberOfPages'`
    })
    @Min( 2, {
        message: 'Numero de paginas bajo el minimo'
    })
    @Max( 1000, {
        message: 'Numero de paginas sobre el maximo'
    })
    numberOfPages: number;

    @IsArray({
        message: `Propiedad 'genres' no es de tipo array`
    })
    @IsNotEmpty({
        message: `Falta definir la propiedad 'genres'`
    })
    @ArrayMinSize( 1, {
        message: `array 'genres' debe contener como minimo un elemento`
    })
    genres: GenreEntity[];
    
    @IsArray({
        message: `Propiedad 'artists' no es de tipo array`
    })
    @IsNotEmpty({
        message: `Falta definir la propiedad 'artists'`
    })
    @ArrayMinSize( 1, {
        message: `array 'artists' debe contener como minimo un elemento`
    })
    artists: ArtistEntity[];

    @IsArray({
        message: `Propiedad 'languages' no es de tipo array`
    })
    @IsNotEmpty({
        message: `Falta definir la propiedad 'languages'`
    })
    @ArrayMinSize( 1, {
        message: `array 'languages' debe contener como minimo un elemento`
    })
    languages: LanguageEntity[];

}