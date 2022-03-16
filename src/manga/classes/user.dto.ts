import { mangaRelations } from '@db/manga/const';
import { Manga } from '@interface/mangaResponses.interface';
import { IsNotEmpty } from 'class-validator';
import { ArrayContainsSome } from './custom-validator/ArrayContainsSome.class-validator';
import { Pagination } from './utils.dto';

export class setFavorite {
  user: {
    id: number;
    username: string;
  };

  @IsNotEmpty({
    message: `Falta definir la propiedad 'manga'`,
  })
  manga: Manga;
}

export class getFavorite extends Pagination {
  user: {
    id: number;
    username: string;
  };

  @ArrayContainsSome(mangaRelations, {
    message: 'Hay campos que no se encuentran definidos en la tabla consultada',
  })
  relations: string[];
}
