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
}
