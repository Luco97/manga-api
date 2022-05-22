import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from './services/jwt.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DbConfigService } from './services/db-config.service';
import { CloudinaryService } from './services/cloudinary.service';
import { MailerService } from './services/mailer.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        signOptions: {
          expiresIn: configService.get<string>('EXPIRES'),
        },
        secret: configService.get<string>('JWT_SEED'),
      }),
      inject: [ConfigService],
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [JwtService, DbConfigService, CloudinaryService, MailerService],
  exports: [JwtService, DbConfigService, CloudinaryService, MailerService],
})
export class SharedModule {}
