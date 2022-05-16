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
    const data: { response: response; data?: User } = await this.getOne(id);
    if (data?.data) {
      const user: UserEntity = data.data as UserEntity;
      const manga = data.data.mangas.find((manga) => manga.id == body.manga.id);
      //Manga ya existe como favorito
      if (manga) {
        user.mangas.splice(data.data.mangas.indexOf(manga), 1);
        await this._userService.save(user);
        this._mangaService.updateLikes(body.manga.id, -1);
        //Prueba ------ Para emitir via socket que un nuevo manga fue creado (evitando listener de postgres)
        this._utilsService.mangaDropSubject.next({
          response: {
            status: HttpStatus.OK,
            message: `Manga con id = '${body.manga.id}' y titulo = '${body.manga.title}' fue quitado de favoritos por someone`,
          },
          data: body.manga,
        });
        //fin Prueba
        const { id, username, email } = user;
        return {
          response: {
            status: HttpStatus.OK,
            message: `Manga con id = '${body.manga.id}' y titulo = '${body.manga.title}' ya existe, Manga eliminado`,
          },
          data: {
            id,
            username,
            email,
            mangas: [],
          },
        };
      }
      user.mangas.push(body.manga as MangaEntity);

      try {
        await this._userService.save(user);
        await this._mangaService.updateLikes(body.manga.id, 1);
      } catch (error) {
        //Manga incorrecto/no existe
        return {
          response: {
            status: HttpStatus.BAD_REQUEST,
            message: `Manga con id = '${body.manga.id}' no existe`,
            error,
          },
        };
      }
      const { id, username, email } = user;
      //Prueba ------ Para emitir via socket que un nuevo manga fue creado (evitando listener de postgres)
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
          id,
          username,
          email,
          mangas: [body.manga as MangaEntity],
        },
      };
    }
    return {
      response: {
        status: HttpStatus.NOT_FOUND,
        message: `No existe un usuario con id = '${id}'`,
      },
    };
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
