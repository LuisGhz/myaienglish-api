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

  async translateText({ context, textToTranslate }: TranslateTextReqDto) {
    return this.openAIService.translateText(textToTranslate, context);
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
