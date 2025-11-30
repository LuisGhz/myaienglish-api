import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OpenAIService } from '../../../common';
import { Instruction } from '../entities/instruction.entity';
import { FavTranslation } from '../entities/fav-translation.entity';
import { TranslateTextReqDto } from '../dtos/translate-text.req.dto';
import { AddFavTranslationReqDto } from '../dtos/add-fav-translation.req.dto';

@Injectable()
export class TranslateService {
  constructor(
    @InjectRepository(Instruction)
    private instructionRepository: Repository<Instruction>,
    @InjectRepository(FavTranslation)
    private favTranslationRepository: Repository<FavTranslation>,
    private openAIService: OpenAIService,
  ) {}

  async translateText({
    instructionId,
    context,
    textToTranslate,
  }: TranslateTextReqDto) {
    const instruction = await this.instructionRepository.findOneBy({
      id: instructionId,
    });
    const prompt = `
        You are an expert on languages translation your job is to help to the user with the given text ""${textToTranslate}"".
        This according to the following instructions: ""${instruction!.content}""
        ${context ? `Also consider the following context which can help you to give a better translation/explanation: ""${context}""` : ''}
      `;

    return this.openAIService.translateText(prompt);
  }

  getFavTranslations() {
    return this.favTranslationRepository.find();
  }

  addFavTranslation(body: AddFavTranslationReqDto) {
    const favTranslation = this.favTranslationRepository.create(body);
    return this.favTranslationRepository.save(favTranslation);
  }

  deleteFavTranslation(id: string) {
    return this.favTranslationRepository.delete(id);
  }
}
