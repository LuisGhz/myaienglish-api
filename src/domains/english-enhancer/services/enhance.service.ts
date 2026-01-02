import { Injectable } from '@nestjs/common';
import { OpenAIService } from '../../../common';
import { EnhanceTextReqDto } from '../dtos/enhance-text.req.dto';

@Injectable()
export class EnhanceService {
  constructor(private openAIService: OpenAIService) {}

  async enhanceText({ context, textToEnhance }: EnhanceTextReqDto) {
    return this.openAIService.enhanceText(textToEnhance, context);
  }
}
