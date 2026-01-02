import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from './config';
import { CommonModule } from './common';
import { JwtAuthGuard } from './common/guards';
import {
  EnglishEnhancerModule,
  AuthModule,
  UserModule,
  PhraseComparisonModule,
} from './domains';

@Module({
  imports: [
    ConfigModule,
    CommonModule,
    EnglishEnhancerModule,
    AuthModule,
    UserModule,
    PhraseComparisonModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
