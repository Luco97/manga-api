import { genreRelations } from "@db/manga/const";
import { ArrayContains, ArrayNotEmpty, IsNotEmpty, IsOptional, Length, ValidateIf } from "class-validator";

export class createGenreDto {
    @IsNotEmpty({
        message: `Falta la propiedad 'tag'`
    })
    @Length( 1, 30, {
        message: 'Esta bajo el minimo/Supera el maximo de caracteres'
    })
    tag: string;
}

export class readGenreDto {
    @IsOptional()
    @ArrayNotEmpty({
        message: `No se encuentran definido 'relations', si no quiere relaciones ingresar 'relations: []'`
    })
    @ArrayContains(genreRelations, {
        message: 'No existen la(s) propiedades'
    })
    relations: string[];
}
