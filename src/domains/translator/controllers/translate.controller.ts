import { Body, Controller, Post } from '@nestjs/common';
import { TranslateService } from '../services/translate.service';
import { TranslateTextReqDto } from '../dtos/translate-text.req.dto';

@Controller('api/translate')
export class TranslateController {
  constructor(private translateService: TranslateService) {}

  @Post()
  async translate(@Body() body: TranslateTextReqDto) {
    return this.translateService.translateText(body);
  }
}
