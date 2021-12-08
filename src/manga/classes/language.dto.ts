import { IsNotEmpty, Length } from "class-validator";

export class createLanguageDto {
    @IsNotEmpty({
        message: `Falta definir la propiedad 'language'`
    })
    @Length( 1, 30, {
        message: 'Esta bajo el minimo/Supera el maximo de caracteres'
    })
    language: string;
}
