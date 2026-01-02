import { Injectable } from '@nestjs/common';
import { OpenAIService } from '../../../common';
import { TranslateTextReqDto } from '../dtos/translate-text.req.dto';

@Injectable()
export class TranslateService {
  constructor(private openAIService: OpenAIService) {}

  async translateText({ context, textToTranslate }: TranslateTextReqDto) {
    return this.openAIService.translateText(textToTranslate, context);
  }
}
