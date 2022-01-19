import { languageRelations } from "@db/manga/const";
import { ArrayContains, ArrayNotEmpty, IsNotEmpty, IsOptional, Length } from "class-validator";

export class createLanguageDto {
    @IsNotEmpty({
        message: `Falta definir la propiedad 'language'`
    })
    @Length( 1, 30, {
        message: 'Esta bajo el minimo/Supera el maximo de caracteres'
    })
    language: string;
    @IsNotEmpty({
        message: `Falta definir la propiedad 'country'`
    })
    @Length( 1, 30, {
        message: 'Esta bajo el minimo/Supera el maximo de caracteres'
    })
    country: string;
}

export class readLanguageDto {
    @IsOptional()
    @ArrayNotEmpty({
        message: `Existe 'relations' pero se encuetra vacio`
    })
    @ArrayContains(languageRelations, {
        message: 'No existen la(s) propiedades'
    })
    relations: string[];
}