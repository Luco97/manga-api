import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailEntity } from '../entity/email.entity';

@Injectable()
export class EmailEntityService {
  constructor(
    @InjectRepository(EmailEntity)
    private _emailRepository: Repository<EmailEntity>,
  ) {}

  get create(): Promise<EmailEntity> {
    return this._emailRepository.save(this._emailRepository.create());
  }

  async findOne(uuid: string): Promise<EmailEntity> {
    return (
      await this._emailRepository.find({
        where: {
          uuid,
          activated: false,
        },
      })
    ).pop();
  }

  async updateStatus(entity: EmailEntity) {
    entity.activated = true;
    this._emailRepository.create(entity); // para disparar @Before u @After en caso de
    return await this._emailRepository.save(entity);
  }
}
