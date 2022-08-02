import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailEntity, RoleEntity, UserEntity } from './entity';
import {
  EmailEntityService,
  RoleEntityService,
  UserEntityService,
} from './service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity, EmailEntity])],
  exports: [UserEntityService, RoleEntityService, EmailEntityService],
  providers: [UserEntityService, RoleEntityService, EmailEntityService],
})
export class UserEntityModule {}
