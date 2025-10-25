import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Instruction } from './entities/instruction.entity';
import { Repository } from 'typeorm';
import { CreateInstructionDto } from './dtos/instructions/create-instruction.dto';
import { UpdateInstructionDto } from './dtos/instructions/update-instruction.dto';
import { TranslateTextReqDto } from './dtos/translate/translate-text.req.dto';
import { OpenAIService } from './openai.service';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(Instruction) private instructionRepository: Repository<Instruction>,
    private openAIService: OpenAIService
  ) { }

  async translateText({ instructionId, context, textToTranslate }: TranslateTextReqDto) {
    const instruction = await this.instructionRepository.findOneBy({ id: instructionId });
    const prompt = `
      You are an expert on languages translation your job is to help to the user with the given text ""${textToTranslate}"".
      This according to the following instructions: ""${instruction!.content}""
      ${context ? `Also consider the following context which can help you to give a better translation: ""${context}""` : ''}
    `;

    return this.openAIService.translateText(prompt);
  }

  getInstructions() {
    return this.instructionRepository.find();
  }

  async createInstruction({ name, content }: CreateInstructionDto): Promise<Instruction> {
    const instruction = this.instructionRepository.create({ name, content });
    return this.instructionRepository.save(instruction);
  }

  async updateInstruction(id: string, updateInstructionDto: UpdateInstructionDto): Promise<Instruction | null> {
    await this.instructionRepository.update(id, updateInstructionDto);
    return this.instructionRepository.findOneBy({ id });
  }

  async deleteInstruction(id: string): Promise<{ success: boolean }> {
    const result = await this.instructionRepository.delete(id);
    return { success: (result.affected ?? 0) > 0 };
  }
}
