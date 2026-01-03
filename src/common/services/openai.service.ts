import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  compareInstructions,
  CompareSchema,
  getComparePrompt,
  getPrompt,
  openAICompareFormat,
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

  async enhanceText(
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

  async compare(
    inputs: string[],
    context?: string,
  ): Promise<CompareSchema | null> {
    const prompt = getComparePrompt(inputs, context);
    const res: any = await this.openai.responses.parse({
      model: 'gpt-4o-mini',
      instructions: compareInstructions,
      input: prompt,
      text: {
        format: openAICompareFormat,
      },
    });
    return res.output_parsed;
  }
}
