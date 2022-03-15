import { LanguageEntity } from '@db/manga/entity';
import { LanguageEntityService } from '@db/manga/services';
import { Language, response } from '@interface/mangaResponses.interface';
import { createLanguageDto } from '@manga/dto';
import { Injectable, HttpStatus } from '@nestjs/common';

@Injectable()
export class LanguageService {
  constructor(private _languageService: LanguageEntityService) {}

  async getAll(): Promise<{ response: response; data: Language[] }> {
    const data: LanguageEntity[] = await this._languageService.findAll([]);
    if (data.length) {
      return {
        response: {
          status: HttpStatus.OK,
          message: 'getAll idiomas',
        },
        data,
      };
    }
    return {
      response: {
        status: HttpStatus.OK,
        message: 'Sin idiomas',
      },
      data: [],
    };
  }

  async getOne(
    id: number,
    relations: string[],
  ): Promise<{ response: response; data?: Language }> {
    const data: LanguageEntity[] = await this._languageService.findBy({
      relations,
      where: {
        id,
      },
    });
    if (data.length) {
      return {
        response: {
          status: HttpStatus.OK,
          message: 'getOne idioma',
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
    createLanguage: createLanguageDto,
  ): Promise<{ response: response; data?: Language }> {
    const languages = await this._languageService.findBy({
      where: {
        language: createLanguage.language.toLocaleLowerCase(),
      },
    });
    if (!languages.length) {
      const newLanguage: LanguageEntity = new LanguageEntity(
        createLanguage.language.toLocaleLowerCase(),
        createLanguage.country.toLocaleLowerCase(),
      );
      const data = await this._languageService.create(newLanguage);
      return {
        response: {
          status: HttpStatus.CREATED,
          message: 'Idioma creado',
        },
        data: data,
      };
    }
    return {
      response: {
        status: HttpStatus.CONFLICT,
        message: 'Ya existe un idioma con ese nombre',
      },
      data: languages.pop(),
    };
  }

  async delete(id: number): Promise<{ response: response; data?: Language }> {
    const data: { response: response; data?: Language } = await this.getOne(
      id,
      [],
    );
    if (data?.data) {
      const language = await this._languageService.delete(
        data.data as LanguageEntity,
      );
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
