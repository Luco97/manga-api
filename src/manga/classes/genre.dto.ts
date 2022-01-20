import { genreRelations } from "@db/manga/const";
import { ArrayContainsSome } from "./custom-validator/ArrayContainsSome.class-validator";
import { ArrayNotEmpty, IsNotEmpty, IsOptional, Length } from "class-validator";

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
    @ArrayContainsSome(genreRelations, {
        message: 'Hay campos que no se encuentran definidos en la tabla consultada'
    })
    relations: string[];
}
