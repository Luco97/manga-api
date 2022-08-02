import { Module } from '@nestjs/common';
import { SharedModule } from './../shared/shared.module';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';
import { UserEntityModule } from '../db/user-model/user-entity.module';

@Module({
    imports: [
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
