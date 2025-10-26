import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateInstructionDto } from "src/dtos/instructions/create-instruction.dto";
import { UpdateInstructionDto } from "src/dtos/instructions/update-instruction.dto";
import { Instruction } from "src/entities/instruction.entity";

@Injectable()
export class InstructionService {
  constructor(
    @InjectRepository(Instruction) private instructionRepository: Repository<Instruction>,
  ) { }

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