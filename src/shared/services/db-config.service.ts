import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LoggerOptions } from 'typeorm';

@Injectable()
export class DbConfigService {
  getTypeORMconfig(
    entity: string = '/../**/*.entity.ts',
  ): TypeOrmModuleOptions {
    return {
      type: 'postgres',

      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      // url: process.env.DATABASE_URL,
      entities: [__dirname + entity],
      autoLoadEntities: true,
      logging: process.env.LOG.split('-') as LoggerOptions,
      ...this.enviromentConfig(),
    };
  }

  private enviromentConfig() {
    switch (process.env.ENVIRONMENT) {
      case 'development':
        return {
          synchronize: true,
        };

      case 'production':
        return {
          synchronize: false,
          ssl: true,
          extra: {
            ssl: {
              rejectUnauthorized: false,
            },
          },
        };
    }
  }
}
