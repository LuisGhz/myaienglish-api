import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Instruction } from './entities/instruction.entity';
import { Repository } from 'typeorm';
import { CreateInstructionDto } from './dtos/instructions/create-instruction.dto';
import { UpdateInstructionDto } from './dtos/instructions/update-instruction.dto';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(Instruction) private instructionRepository: Repository<Instruction>,
  ) { }

  getHello(): string {
    return 'Hello World!';
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
