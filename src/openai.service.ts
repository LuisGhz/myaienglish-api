import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { TranslateTextResDto } from "./dtos/translate/translate-text.res.dto";

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }


  async translateText(prompt: string): Promise<TranslateTextResDto> {
    const res = await this.openai.responses.create({
      model: 'gpt-4o-mini',
      input: prompt
    });
    return {
      translatedText: res.output_text,
      inputTokens: res.usage?.input_tokens,
      outputTokens: res.usage?.output_tokens,
      totalTokens: res.usage?.total_tokens,
    };
  }

}