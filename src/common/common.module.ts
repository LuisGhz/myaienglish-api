import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { OpenAIService } from './services/openai.service';
import { JwtAuthGuard } from './guards';
import { ConfigModule as NestConfigModule, EnvService } from '../config';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [NestConfigModule],
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        secret: envService.jwtSecret,
        signOptions: { expiresIn: envService.jwtExpiresIn as any },
      }),
    }),
  ],
  providers: [
    OpenAIService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [OpenAIService, JwtModule],
})
export class CommonModule {}
