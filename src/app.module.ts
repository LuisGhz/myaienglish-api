import { Module } from '@nestjs/common';
import { ConfigModule } from './config';
import { CommonModule } from './common';
import { EnglishEnhancerModule, AuthModule, UserModule } from './domains';

@Module({
  imports: [
    ConfigModule,
    CommonModule,
    EnglishEnhancerModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
