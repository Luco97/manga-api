import { IsNotEmpty, Length } from 'class-validator';
import { genreRelations, mangaRelations } from '@db/manga/const';
import { ArrayContainsSome } from './custom-validator/ArrayContainsSome.class-validator';
import { Pagination } from './utils.dto';

export class createGenreDto {
  @IsNotEmpty({
    message: `Falta la propiedad 'tag'`,
  })
  @Length(1, 30, {
    message: 'Esta bajo el minimo/Supera el maximo de caracteres',
  })
  tag: string;
}

export class readGenreDto extends Pagination {
  @ArrayContainsSome(genreRelations, {
    message: 'Hay campos que no se encuentran definidos en la tabla consultada',
  })
  relations: string[];
}

export class readGenre_getMangasDto extends Pagination {
  @ArrayContainsSome(mangaRelations, {
    message: 'Hay campos que no se encuentran definidos en la tabla consultada',
  })
  relations: string[];
}
