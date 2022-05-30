import { Injectable, HttpStatus } from '@nestjs/common';
import { MangaEntity } from '@db/manga/entity';
import { response, User } from '@interface/mangaResponses.interface';
import { getFavorite, setFavorite } from '@manga/dto';
import { UserEntity } from '@db/user/entity';
import { UserEntityService } from '@db/user/service';
import { MangaEntityService } from '@db/manga/services';
import { UtilsService } from './utils.service';

@Injectable()
export class UserService {
  constructor(
    private _userService: UserEntityService,
    private _mangaService: MangaEntityService,
    private _utilsService: UtilsService,
  ) {}

  async getOne(
    id: number,
    relations: string[] = ['mangas'],
  ): Promise<{ response: response; data?: User }> {
    const data: UserEntity[] = await this._userService.findBy({
      select: ['id', 'username', 'email'],
      relations,
      where: {
        id,
      },
    });
    if (data.length) {
      return {
        response: {
          status: HttpStatus.OK,
          message: 'getOne user',
        },
        data: data.pop(),
      };
    }
    return {
      response: {
        status: HttpStatus.NOT_FOUND,
        message: `No existe un usuario con id = '${id}'`,
      },
    };
  }

  async getFavorites(
    getFavoritesBody: getFavorite,
  ): Promise<{ response: response; data?: User }> {
    const { take, skip, user, relations } = getFavoritesBody;
    const [mangas, count] = await this._mangaService.getMangasById({
      relations,
      take,
      skip,
      relation_name: 'users',
      relation_id: user.id,
    });
    //.getFavoritesById( user.id, relations, take, skip);
    const { data }: { response: response; data?: User } = await this.getOne(
      user.id,
      [],
    );

    if (data) {
      data.mangas = mangas;
      return {
        response: {
          status: 200,
          message: 'getFavorites',
        },
        data: {
          ...data,
          count,
        },
      };
    }
    return {
      response: {
        status: HttpStatus.NOT_FOUND,
        message: 'Error dentro del metodo getFavorites',
      },
    };
  }

  async setFavorite(
    id: number,
    body: setFavorite,
  ): Promise<{ response: response; data?: User }> {
    const { data } = await this.getOne(id, []);
    const { manga } = body;
    const favoriteStatus = await this._userService.checkIfFavoriteByUser(
      manga.id,
      data.id,
    );
    if (!favoriteStatus) {
      await this._userService.saveManga(data.id, manga.id);
      await this._mangaService.updateLikes(body.manga.id, 1);
      //Prueba ------ Para emitir via socket que un nuevo manga fue agregado a favoritos (evitando listener de postgres)
      this._utilsService.mangaFavoriteSubject.next({
        response: {
          status: HttpStatus.CREATED,
          message: 'Manga agregado a favorito',
        },
        data: body.manga,
      });
      //fin Prueba
      return {
        response: {
          status: HttpStatus.OK,
          message: 'setFavorite user',
        },
        data: {
          ...data,
          mangas: [manga as MangaEntity],
        },
      };
    } else {
      await this._userService.removeManga(data.id, manga.id);
      this._mangaService.updateLikes(body.manga.id, -1);
      //Prueba ------ Para emitir via socket que un nuevo manga fue quitado de favoritos (evitando listener de postgres)
      this._utilsService.mangaDropSubject.next({
        response: {
          status: HttpStatus.OK,
          message: `Manga quitado de favoritos`,
        },
        data: body.manga,
      });
      //fin Prueba
      return {
        response: {
          status: HttpStatus.OK,
          message: `Manga con id = '${body.manga.id}' y titulo = '${body.manga.title}' ya existe, Manga eliminado`,
        },
        data: {
          ...data,
          mangas: [],
        },
      };
    }
  }

  async checkFavorite(
    id_manga: number,
    id_user: number,
  ): Promise<{ response: response; isFavorite?: boolean }> {
    const isFavorite: boolean = await this._userService.checkIfFavoriteByUser(
      id_manga,
      id_user,
    );
    return {
      response: {
        status: HttpStatus.OK,
        message: 'Check para saber si es favorito',
      },
      isFavorite,
    };
  }
}
