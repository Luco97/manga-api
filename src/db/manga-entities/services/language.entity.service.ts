import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { LanguageEntity, MangaEntity } from '@db/manga/entity';


@Injectable()
export class LanguageEntityService {

    constructor(
        @InjectRepository(LanguageEntity)
        private languageRepository: Repository<LanguageEntity>
    ) {}

    async findAll(relations: string[] = ['mangas']): Promise<LanguageEntity[]> {
        const data: LanguageEntity[] = await this.languageRepository.find({relations});
        return data;
    }

    async findOne( id: number, relations: string[] = ['mangas']): Promise<LanguageEntity> {
        const data: LanguageEntity = await this.languageRepository.findOne(id, {relations});
        if(!data) throw new NotFoundException(`No existe el lenguaje con id=${id}`);
        return data;
    }

    async findBy(options: FindOneOptions<LanguageEntity>): Promise<LanguageEntity[]> {
        const data: LanguageEntity[] = await this.languageRepository.find(options);
        return data;
    }

    async create( language: LanguageEntity) {
        const data = this.languageRepository.create(language);
        return await this.languageRepository.save(data);
    }

    async delete( language: LanguageEntity) {
        const data: LanguageEntity = await this.findOne(language.id, []);
        return await this.languageRepository.remove(data)
    }

    async createTranslate( manga: MangaEntity, language: LanguageEntity) {
        const lenguaje: LanguageEntity = await this.findOne(language.id);
        lenguaje.mangas.push({...manga} as MangaEntity);
        return await this.languageRepository.save(lenguaje);
    }
}
