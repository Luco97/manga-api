import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity, UserEntity } from './entity';
import { RoleEntityService, UserEntityService } from './service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
  exports: [UserEntityService, RoleEntityService],
  providers: [UserEntityService, RoleEntityService],
})
export class UserEntityModule {}
