import { Injectable, HttpStatus } from '@nestjs/common';
import { GenreEntityService, MangaEntityService } from '@db/manga/services';
import { Genre, response } from '@interface/mangaResponses.interface';
import { GenreEntity, MangaEntity } from '@db/manga/entity';
import {
  createGenreDto,
  readGenreDto,
  readGenre_getMangasDto,
} from '@manga/dto';

@Injectable()
export class GenreService {
  constructor(
    private _genreService: GenreEntityService,
    private _mangaService: MangaEntityService,
  ) {}

  async getAll(
    readGenres: readGenreDto,
  ): Promise<{ response: response; data: GenreEntity[] }> {
    const { take, skip, relations } = readGenres;
    const elements = {
      take,
      skip,
      relations,
    };
    const data: GenreEntity[] = await this._genreService.findBy({
      ...elements,
    });
    if (data.length) {
      return {
        response: {
          status: HttpStatus.OK,
          message: 'getAll generos',
        },
        data,
      };
    }
    return {
      response: {
        status: HttpStatus.OK,
        message: 'Sin generos',
      },
      data: [],
    };
  }

  async getGenreMangas(
    genre_id: number,
    getGenreBody: readGenre_getMangasDto,
  ): Promise<{ response: response; data?: Genre }> {
    const { skip, take, relations } = getGenreBody;
    const data: MangaEntity[] = await this._mangaService.getMangasById({
      relations,
      take,
      skip,
      relation_id: genre_id,
      relation_name: 'genres',
    });
    const genre = await this.getOne(genre_id, []);
    if (genre?.data)
      return {
        response: {
          status: HttpStatus.OK,
          message:
            'getMangas por un genero, mangas paginados y con opciones de relaciones',
        },
        data: {
          ...genre.data,
          mangas: data,
        },
      };
    return {
      response: {
        status: HttpStatus.NOT_FOUND,
        message: `No existe genero con id = '${genre_id}'`,
      },
    };
  }

  async getOne(
    id: number,
    relations: string[],
  ): Promise<{ response: response; data?: Genre }> {
    const data: GenreEntity[] = await this._genreService.findBy({
      relations,
      where: {
        id,
      },
    });
    if (data.length) {
      return {
        response: {
          status: HttpStatus.OK,
          message: 'getOne generos',
        },
        data: data.pop(),
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
    createGenre: createGenreDto,
  ): Promise<{ response: response; data?: Genre }> {
    const genres: GenreEntity[] = await this._genreService.findBy({
      where: {
        tag: createGenre.tag.toLocaleLowerCase(),
      },
    });
    if (!genres.length) {
      const newGenre: GenreEntity = new GenreEntity(
        createGenre.tag.toLocaleLowerCase(),
      );
      const data = await this._genreService.create(newGenre);
      return {
        response: {
          status: HttpStatus.CREATED,
          message: 'Genero creado',
        },
        data,
      };
    }
    return {
      response: {
        status: HttpStatus.CONFLICT,
        message: 'Ya existe un genero con ese tag',
      },
      data: genres.pop(),
    };
  }

  async delete(id: number): Promise<{ response: response; data?: Genre }> {
    const data: { response: response; data?: Genre } = await this.getOne(
      id,
      [],
    );
    if (data?.data) {
      const genre = await this._genreService.delete(data.data as GenreEntity);
      return {
        response: {
          status: HttpStatus.OK,
          message: 'Idioma borrado',
        },
        data: data.data,
      };
    }
    return {
      response: {
        status: HttpStatus.NOT_FOUND,
        message: `Idioma con id = '${id}' no existe`,
      },
    };
  }
}
