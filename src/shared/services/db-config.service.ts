import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';


@Injectable()
export class DbConfigService {
  getTypeORMconfig(entity: string = '/../**/*.entity.ts'): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [
        __dirname + entity
      ],
      synchronize: true,
      autoLoadEntities: true
    };
  }
}
