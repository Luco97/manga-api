import { Injectable, HttpStatus } from '@nestjs/common';
import { ArtistEntityService, MangaEntityService } from '@db/manga/services';
import { response, Artist } from '@interface/mangaResponses.interface';
import { ArtistEntity, MangaEntity } from '@db/manga/entity';
import {
  createArtistDto,
  readArtistDto,
  readArtist_getMangasDto,
  updateArtistsDto,
} from '@manga/dto';

@Injectable()
export class ArtistService {
  constructor(
    private _artistService: ArtistEntityService,
    private _mangaService: MangaEntityService,
  ) {}

  async getAll(
    getArtists: readArtistDto,
  ): Promise<{ response: response; data: Artist[] }> {
    const { skip, take, relations } = getArtists;
    const elements: readArtistDto = {
      skip,
      take,
      relations,
    };
    const data: ArtistEntity[] = await this._artistService.findBy({
      ...elements,
    });
    if (data.length) {
      return {
        response: {
          status: HttpStatus.OK,
          message: 'getAll artistas',
        },
        data: data,
      };
    }
    return {
      response: {
        status: HttpStatus.OK,
        message: 'Sin artistas',
      },
      data: [],
    };
  }

  async getArtistMangas(
    artist_id: number,
    getArtistsBody: readArtist_getMangasDto,
  ): Promise<{ response: response; data?: Artist }> {
    const { skip, take, relations } = getArtistsBody;
    const [data, count] = await this._mangaService.getMangasById({
      skip,
      take,
      relations,
      relation_id: artist_id,
      relation_name: 'artists',
    });
    const artist = await this.getOne(artist_id, []);
    if (artist?.data)
      return {
        response: {
          status: HttpStatus.OK,
          message:
            'getMangas por un artista, mangas paginados y con opciones de relaciones',
        },
        data: {
          ...artist.data,
          mangas: data,
          count
        },
      };
    return {
      response: {
        status: HttpStatus.NOT_FOUND,
        message: `No existe artista con id = '${artist_id}'`,
      },
    };
  }

  async getOne(
    id: number,
    relations: string[],
  ): Promise<{ response: response; data?: Artist }> {
    const data: ArtistEntity = await this._artistService.findOne(id);
    if (data) {
      return {
        response: {
          status: HttpStatus.OK,
          message: 'getOne artistas',
        },
        data: data,
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
    createArtist: createArtistDto,
  ): Promise<{ response: response; data?: Artist }> {
    const artists: ArtistEntity[] = await this._artistService.findBy({
      where: {
        name: createArtist.name.toLocaleLowerCase(),
      },
    });
    if (!artists.length) {
      const newArtist: ArtistEntity = new ArtistEntity(
        createArtist.name.toLocaleLowerCase(),
        createArtist?.age,
        createArtist?.type,
        createArtist?.description,
      );
      const data = await this._artistService.create(newArtist);
      return {
        response: {
          status: HttpStatus.CREATED,
          message: 'Artista creado',
        },
        data,
      };
    }
    return {
      response: {
        status: HttpStatus.CONFLICT,
        message: 'Ya existe un artista con ese nombre',
      },
      data: artists.pop(),
    };
  }

  async update(
    id: number,
    updateArtist: updateArtistsDto,
  ): Promise<{ response: response; data?: Artist }> {
    const artists: ArtistEntity[] = await this._artistService.findBy({
      where: {
        id,
      },
    });

    if (artists.length) {
      const artist: ArtistEntity = artists.pop();
      updateArtist.age ? (artist.age = updateArtist.age) : 0;
      updateArtist.description
        ? (artist.description = updateArtist.description)
        : 0;
      updateArtist.type ? (artist.type = updateArtist.type) : 0;

      await this._artistService.create(artist);

      return {
        response: {
          status: HttpStatus.OK,
          message: `Artista ${artist.name} actualizado`,
        },
        data: artist,
      };
    }

    return {
      response: {
        status: HttpStatus.NOT_FOUND,
        message: 'Artista no encontrado',
      },
    };
  }

  async delete(id: number): Promise<{ response: response; data?: Artist }> {
    const data: { response: response; data?: Artist } = await this.getOne(
      id,
      [],
    );
    if (data?.data) {
      const artist = await this._artistService.delete(
        data.data as ArtistEntity,
      );
      return {
        response: {
          status: HttpStatus.OK,
          message: 'Artista eliminado',
        },
        data: data.data,
      };
    }
    return {
      response: {
        status: HttpStatus.NOT_FOUND,
        message: `Artista con id = ${id} no existe`,
      },
    };
  }
}
