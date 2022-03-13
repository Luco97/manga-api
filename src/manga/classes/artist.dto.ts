import { IsNotEmpty, IsOptional, Length, Max, Min } from 'class-validator';
import { artistRelations, mangaRelations } from '@db/manga/const';
import { ArrayContainsSome } from './custom-validator/ArrayContainsSome.class-validator';
import { Pagination } from './utils.dto';

export class readArtistDto extends Pagination {
  @ArrayContainsSome(artistRelations, {
    message: 'Hay campos que no se encuentran definidos en la tabla consultada',
  })
  relations: string[];
}

export class readArtist_getMangasDto extends Pagination {
  @ArrayContainsSome(mangaRelations, {
    message: 'Hay campos que no se encuentran definidos en la tabla consultada',
  })
  relations: string[];
}

export class updateArtistsDto {
  @IsOptional()
  seudoName: string;

  @IsOptional()
  @Min(10, {
    message: 'Edad bajo el minimo',
  })
  @Max(60, {
    message: 'Edad sobre el maximo',
  })
  age: number;

  @IsOptional()
  @Length(1, 35, {
    message: 'Esta bajo el minimo/Supera el maximo de caracteres',
  })
  country: string;

  @IsOptional()
  @Length(1, 20, {
    message: 'Esta bajo el minimo/Supera el maximo de caracteres',
  })
  type: string;

  @IsOptional()
  @Length(1, 250, {
    message: 'Esta bajo el minimo/Supera el maximo de caracteres',
  })
  description: string;
}

export class createArtistDto extends updateArtistsDto {
  @IsNotEmpty({
    message: `No se encuentra definida la propiedad 'name'`,
  })
  @Length(1, 35, {
    message: 'Esta bajo el minimo/Supera el maximo de caracteres',
  })
  name: string;
}
