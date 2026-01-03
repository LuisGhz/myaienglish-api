import { Injectable } from '@nestjs/common';
import { OpenAIService } from '../../../common';
import { ComparePhrasesReqDto } from '../dtos/compare-phrases.req.dto';

@Injectable()
export class PhraseComparisonService {
  constructor(private openAIService: OpenAIService) {}

  async comparePhrases(dto: ComparePhrasesReqDto) {
    const { inputs, context } = dto;
    return await this.openAIService.compare(inputs, context);
  }
}
