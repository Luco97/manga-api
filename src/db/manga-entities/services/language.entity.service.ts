import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { LanguageEntity } from '@db/manga/entity';
import { from, Observable } from 'rxjs';

@Injectable()
export class LanguageEntityService {
  constructor(
    @InjectRepository(LanguageEntity)
    private languageRepository: Repository<LanguageEntity>,
  ) {}

  findAll(relations: string[] = ['mangas']): Observable<LanguageEntity[]> {
    return from(this.languageRepository.find({ relations }));
  }

  findOne(
    id: number,
    relations: string[] = ['mangas'],
  ): Observable<LanguageEntity> {
    return from(this.languageRepository.findOne(id, { relations }));
  }

  findBy(
    options: FindOneOptions<LanguageEntity>,
  ): Observable<LanguageEntity[]> {
    return from(this.languageRepository.find(options));
  }

  create(language: LanguageEntity): Observable<LanguageEntity> {
    const data = this.languageRepository.create(language);
    return from(this.languageRepository.save(data));
  }

  delete(language: LanguageEntity): Observable<LanguageEntity> {
    const observer = new Observable<LanguageEntity>((subscriber) => {
      this.findOne(language.id, []).subscribe((element: LanguageEntity) => {
        from(this.languageRepository.remove(element)).subscribe(
          (removedElement: LanguageEntity) => {
            subscriber.next(removedElement);
            subscriber.complete();
          },
        );
      });
    });
    return observer;
  }
}
