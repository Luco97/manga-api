import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoleEntity } from '../entity/role.entity';

@Injectable()
export class RoleEntityService {
  constructor(
    @InjectRepository(RoleEntity)
    private _roleRepository: Repository<RoleEntity>,
  ) {}

  async find(id: number): Promise<boolean> {
    const query: number = await this._roleRepository
      .createQueryBuilder('role')
      .innerJoin('role.users', 'user', 'user.id = :id', { id })
      .where('role.role_name = :type', { type: 'admin' })
      .orderBy()
      .getCount();
    return query ? true : false;
  }

  get getCommon(): Promise<RoleEntity> {
    return this._roleRepository.findOne({
      where: {
        role_name: 'common',
      },
    });
  }
}
