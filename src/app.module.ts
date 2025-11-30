import { Module } from '@nestjs/common';
import { ConfigModule } from './config';
import { CommonModule } from './common';
import { TranslatorModule, AuthModule, UserModule } from './domains';

@Module({
  imports: [ConfigModule, CommonModule, TranslatorModule, AuthModule, UserModule],
})
export class AppModule {}
