import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  getPrompt,
  openAITranslationFormat,
  translationInstructions,
  TranslationSchema,
} from '../utils';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async translateText(
    text: string,
    context?: string,
  ): Promise<TranslationSchema | null> {
    const prompt = getPrompt(text, context);
    const res = await this.openai.responses.parse({
      model: 'gpt-4o-mini',
      instructions: translationInstructions,
      input: prompt,
      text: {
        format: openAITranslationFormat,
      },
    });
    return res.output_parsed;
  }
}
