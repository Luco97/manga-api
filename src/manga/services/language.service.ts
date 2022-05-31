import { LanguageEntity } from '@db/manga/entity';
import { LanguageEntityService } from '@db/manga/services';
import { Language, response } from '@interface/mangaResponses.interface';
import { createLanguageDto } from '@manga/dto';
import { Injectable, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LanguageService {
  constructor(private _languageService: LanguageEntityService) {}

  getAll(): Observable<{ response: response; data: Language[] }> {
    const observer = new Observable<{ response: response; data: Language[] }>(
      (subscriber) => {
        this._languageService
          .findAll([])
          .subscribe((data: LanguageEntity[]) => {
            if (data.length) {
              subscriber.next({
                response: {
                  status: HttpStatus.OK,
                  message: 'getAll idiomas',
                },
                data,
              });
            } else {
              subscriber.next({
                response: {
                  status: HttpStatus.OK,
                  message: 'Sin idiomas',
                },
                data: [],
              });
            }
            subscriber.complete();
          });
      },
    );
    return observer;
  }

  getOne(
    id: number,
    relations: string[],
  ): Observable<{ response: response; data?: Language }> {
    const observer = new Observable<{ response: response; data?: Language }>(
      (subscriber) => {
        this._languageService
          .findBy({
            relations,
            where: {
              id,
            },
          })
          .subscribe((data: LanguageEntity[]) => {
            if (data.length) {
              subscriber.next({
                response: {
                  status: HttpStatus.OK,
                  message: 'getOne idioma',
                },
                data: data.pop(),
              });
            } else {
              subscriber.next({
                response: {
                  status: HttpStatus.NOT_FOUND,
                  message: 'No encontrado',
                },
              });
            }
            subscriber.complete();
          });
      },
    );
    return observer;
  }

  create(
    createLanguage: createLanguageDto,
  ): Observable<{ response: response; data?: Language }> {
    const observer = new Observable<{ response: response; data?: Language }>(
      (subscriber) => {
        this._languageService
          .findBy({
            where: {
              language: createLanguage.language.toLocaleLowerCase(),
            },
          })
          .subscribe((languages: LanguageEntity[]) => {
            if (!languages.length) {
              const newLanguage: LanguageEntity = new LanguageEntity(
                createLanguage.language.toLocaleLowerCase(),
                createLanguage.country.toLocaleLowerCase(),
                createLanguage?.country_flag,
              );
              this._languageService
                .create(newLanguage)
                .subscribe((data: LanguageEntity) => {
                  subscriber.next({
                    response: {
                      status: HttpStatus.CREATED,
                      message: 'Idioma creado',
                    },
                    data: data,
                  });
                  subscriber.complete();
                });
            } else {
              subscriber.next({
                response: {
                  status: HttpStatus.CONFLICT,
                  message: 'Ya existe un idioma con ese nombre',
                },
                data: languages.pop(),
              });
              subscriber.complete();
            }
          });
      },
    );
    return observer;
  }

  delete(id: number): Observable<{ response: response; data?: Language }> {
    const observer = new Observable<{ response: response; data?: Language }>(
      (subscriber) => {
        this.getOne(id, []).subscribe(
          (data: { response: response; data?: Language }) => {
            if (data?.data) {
              this._languageService
                .delete(data.data as LanguageEntity)
                .subscribe((language: LanguageEntity) => {
                  subscriber.next({
                    response: {
                      status: HttpStatus.OK,
                      message: 'Idioma borrado',
                    },
                    data: data.data,
                  });
                  subscriber.complete();
                });
            } else {
              subscriber.next({
                response: {
                  status: HttpStatus.NOT_FOUND,
                  message: `Idioma con id = '${id}' no existe`,
                },
              });
              subscriber.complete();
            }
          },
        );
      },
    );
    return observer;
  }
}
