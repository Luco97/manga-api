import { IsNotEmpty, Length } from "class-validator";

export class createGenreDto {
    @IsNotEmpty({
        message: `Falta la propiedad 'tag'`
    })
    @Length( 1, 30, {
        message: 'Esta bajo el minimo/Supera el maximo de caracteres'
    })
    tag: string;
}
