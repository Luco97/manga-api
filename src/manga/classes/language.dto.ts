import { languageRelations } from '@db/manga/const';
import { ArrayContainsSome } from './custom-validator/ArrayContainsSome.class-validator';
import { ArrayNotEmpty, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class createLanguageDto {
  @IsNotEmpty({
    message: `Falta definir la propiedad 'language'`,
  })
  @Length(1, 30, {
    message: 'Esta bajo el minimo/Supera el maximo de caracteres',
  })
  language: string;
  @IsNotEmpty({
    message: `Falta definir la propiedad 'country'`,
  })
  @Length(1, 30, {
    message: 'Esta bajo el minimo/Supera el maximo de caracteres',
  })
  country: string;

  country_flag?: string;
}

export class readLanguageDto {
  @IsOptional()
  @ArrayNotEmpty({
    message: `Existe 'relations' pero se encuetra vacio`,
  })
  @ArrayContainsSome(languageRelations, {
    message: 'Hay campos que no se encuentran definidos en la tabla consultada',
  })
  relations: string[];
}
