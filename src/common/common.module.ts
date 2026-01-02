import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { OpenAIService } from './services/openai.service';
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
  providers: [OpenAIService],
  exports: [OpenAIService, JwtModule],
})
export class CommonModule {}
