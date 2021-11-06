import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from './services/jwt.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        signOptions: {
           expiresIn: configService.get<string>('EXPIRES'),
        },
        secretOrPrivateKey: configService.get<string>('JWT_SEED'),
      }),
      inject: [ConfigService], 
    })
  ],
  providers: [
    JwtService
  ],
  exports: [
    JwtService
  ]
})
export class SharedModule {}
