import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { RefreshToken } from './entities';
import { AuthService, RefreshTokenService } from './services';
import { AuthController } from './controllers';
import { UserModule } from '../user';
import { ConfigModule, EnvService } from '../../config';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        secret: envService.jwtSecret,
        signOptions: { expiresIn: envService.jwtExpiresIn as any },
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenService],
  exports: [AuthService, RefreshTokenService],
})
export class AuthModule {}
