import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DbConfigService } from '@Shared/services';
import { SharedModule } from './../shared/shared.module';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';
import { UserEntityModule } from '../db/user-entity/user-entity.module';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [SharedModule],
            inject:[DbConfigService],
            useFactory: async ( dbService: DbConfigService): Promise<TypeOrmModuleOptions> => {
                console.log('Conexion desde auth...');
                return dbService.getTypeORMconfig('/../**/user.entity.ts');
            }
        }),
        UserEntityModule,
        SharedModule
    ],
    providers:[
        AuthService,
    ],
    controllers: [
        AuthController
    ]
})
export class AuthModule {}
