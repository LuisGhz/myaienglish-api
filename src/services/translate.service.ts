import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AddFavTranslationReqDto } from "src/dtos/translate/add-fav-translation.req.dto";
import { TranslateTextReqDto } from "src/dtos/translate/translate-text.req.dto";
import { FavTranslation } from "src/entities/fav-translation.entity";
import { Instruction } from "src/entities/instruction.entity";
import { OpenAIService } from "./openai.service";

@Injectable()
export class TranslateService {

  constructor(
    @InjectRepository(Instruction) private instructionRepository: Repository<Instruction>,
    @InjectRepository(FavTranslation) private favTranslationRepository: Repository<FavTranslation>,
    private openAIService: OpenAIService
  ) { }

  async translateText({ instructionId, context, textToTranslate }: TranslateTextReqDto) {
    const instruction = await this.instructionRepository.findOneBy({ id: instructionId });
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