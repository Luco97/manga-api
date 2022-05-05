import { Injectable, HttpStatus } from '@nestjs/common';
import { MangaEntity } from '@db/manga/entity';
import { UserEntityService } from '@db/user/service';
import { MangaEntityService } from '@db/manga/services';
import {
  Manga,
  MangaResponse,
  response,
} from '@interface/mangaResponses.interface';
import { createMangaDto, readMangaDto, updateMangaDto } from '@manga/dto';
import { UtilsService } from './utils.service';

@Injectable()
export class MangaService {
  constructor(
    private _utilsService: UtilsService,
    private _userService: UserEntityService,
    private _mangaService: MangaEntityService,
  ) {}

  async getAll(
    getMangas: readMangaDto,
    name?: string,
  ): Promise<{ response: response; data: Manga[] }> {
    const { skip, take, relations, property, order } = getMangas;
    const search_keyword = `%${name || ''}%`;

    const data: MangaEntity[] = await this._mangaService
      // .findBy({
      //   relations,
      //   take,
      //   skip,
      //   order: {
      //     id: 'DESC',
      //   },
      //   where: {
      //     title: Like(search_keyword),
      //   },
      // });
      .findAll({ relations, take, skip, search_keyword, property, order });
    if (getMangas?.user?.id && data.length) {
      const promiseArray: Promise<boolean>[] = [];
      const auxManga: Manga[] = [...data];
      auxManga.forEach((element) => {
        promiseArray.push(
          this._userService.checkIfFavoriteByUser(
            element.id,
            getMangas.user.id,
          ),
        );
      });
      const resultPromise: boolean[] = await Promise.all(promiseArray);
      auxManga.forEach(
        (element, index) => (element.isFavorite = resultPromise[index]),
      );
      return {
        response: {
          status: HttpStatus.OK,
          message: 'getAll mangas',
        },
        data: auxManga,
      };
    }
    if (data.length) {
      return {
        response: {
          status: HttpStatus.OK,
          message: 'getAll mangas',
        },
        data,
      };
    }
    return {
      response: {
        status: HttpStatus.OK,
        message: 'Sin mangas',
      },
      data: [],
    };
  }

  async getOne(
    id: number,
    relations: string[],
  ): Promise<{ response: response; data?: MangaResponse }> {
    const data: MangaEntity[] = await this._mangaService.findBy({
      relations,
      where: {
        id,
      },
    });
    if (data.length) {
      const { artists, pages, likes, genres, id, languages, title, users } =
        data.pop();
      return {
        response: {
          status: HttpStatus.OK,
          message: 'getOne Manga',
        },
        data: {
          artists,
          pages,
          likes,
          genres,
          id,
          languages,
          title,
          count: users?.length,
        },
      };
    }
    return {
      response: {
        status: HttpStatus.NOT_FOUND,
        message: 'No encontrado',
      },
    };
  }

  async create(
    createManga: createMangaDto,
  ): Promise<{ response: response; data?: Manga }> {
    const mangas: MangaEntity[] = await this._mangaService.findBy({
      where: {
        title: createManga.title.toLocaleLowerCase(),
      },
    });
    if (!mangas.length) {
      const newManga = new MangaEntity(
        createManga.title.toLocaleLowerCase(),
        createManga.pages,
        createManga.genres,
        createManga.artists,
        createManga.languages,
      );
      const data: MangaEntity = await this._mangaService.create(newManga);
      //Prueba ------ Para emitir via socket que un nuevo manga fue creado (evitando listener de postgres)
      this._utilsService.mangaCreateSubject.next({
        response: {
          status: HttpStatus.CREATED,
          message: 'Manga creado',
        },
        data,
      });
      //fin Prueba
      return {
        response: {
          status: HttpStatus.CREATED,
          message: 'Manga creado',
        },
        data,
      };
    }
    return {
      response: {
        status: HttpStatus.CONFLICT,
        message: 'Ya existe un manga con ese titulo',
      },
      data: mangas.pop(),
    };
  }

  async updateMangaContent(
    id: number,
    updateManga: updateMangaDto,
  ): Promise<{ response: response; newData?: Manga; oldData?: Manga }> {
    const data: { response: response; data?: Manga } = await this.getOne(id, [
      'artists',
      'genres',
      'languages',
    ]);
    if (data?.data) {
      const manga: Manga = { ...data.data };

      manga.title = updateManga?.title || manga.title;
      manga.pages = updateManga?.pages || manga.pages;
      manga.artists = updateManga?.artists || manga.artists;
      manga.genres = updateManga?.genres || manga.genres;
      manga.languages = updateManga?.languages || manga.languages;

      const updatedManga: MangaEntity = await this._mangaService.create(
        manga as MangaEntity,
      );

      return {
        response: {
          status: HttpStatus.OK,
          message: 'Manga actualizado',
        },
        newData: updatedManga,
        oldData: data.data,
      };
    }
    return {
      response: {
        status: HttpStatus.NOT_FOUND,
        message: `No se encuentra un manga con id = '${id}'`,
      },
    };
  }

  async delete(id: number): Promise<{ response: response; data?: Manga }> {
    const data: { response: response; data?: Manga } = await this.getOne(
      id,
      [],
    );
    if (data?.data) {
      const manga = await this._mangaService.delete(data.data as MangaEntity);
      return {
        response: {
          status: HttpStatus.OK,
          message: 'Manga eliminado',
        },
        data: data.data,
      };
    }
    return {
      response: {
        status: HttpStatus.NOT_FOUND,
        message: `No se encuentra un manga con id = '${id}'`,
      },
    };
  }
}
