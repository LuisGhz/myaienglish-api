import { Module } from '@nestjs/common';
import { TranslateService } from './services/translate.service';
import { TranslateController } from './controllers/translate.controller';

@Module({
  controllers: [TranslateController],
  providers: [TranslateService],
  exports: [TranslateService],
})
export class TranslatorModule {}
