import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity';
import { UserEntityService } from './service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  exports: [UserEntityService],
  providers: [UserEntityService],
})
export class UserEntityModule {}
