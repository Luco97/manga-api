import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


import { MangaEntity } from '../entity/manga.entity';

@Injectable()
export class MangaService {
    constructor(
        @InjectRepository(MangaEntity) private mangaRepository: Repository<MangaEntity>
    ) {}
}
