import { artistRelations } from '@db/manga/const';
import { ArrayContains, ArrayNotEmpty, IsNotEmpty, IsOptional, Length, Max, Min } from 'class-validator';


export class readArtistDto {
    @IsOptional()
    @ArrayNotEmpty({
        message: `No se encuentran definido 'relations', si no quiere relaciones ingresar 'relations: []'`
    })
    @ArrayContains(artistRelations, {
        message: 'No existen la(s) propiedades'
    })
    relations: string[];
}

export class updateArtistsDto {
    @IsOptional()
    seudoName: string;
    
    @IsOptional()
    @Min( 10, {
        message: 'Edad bajo el minimo'
    })
    @Max( 60, {
        message: 'Edad sobre el maximo'
    })
    age: number;
    
    @IsOptional()
    @Length( 1, 35, {
        message: 'Esta bajo el minimo/Supera el maximo de caracteres'
    })
    country: string;
    
    @IsOptional()
    @Length( 1, 20, {
        message: 'Esta bajo el minimo/Supera el maximo de caracteres'
    })
    type: string;
    
    @IsOptional()
    @Length( 1, 250, {
        message: 'Esta bajo el minimo/Supera el maximo de caracteres'
    })
    description: string;
}

export class createArtistDto extends updateArtistsDto {
    @IsNotEmpty({
        message: `No se encuentra definida la propiedad 'name'`
    })
    @Length( 1, 35, {
        message: 'Esta bajo el minimo/Supera el maximo de caracteres'
    })
    name: string;
}