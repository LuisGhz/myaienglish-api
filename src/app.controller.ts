import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateInstructionDto } from './dtos/instructions/create-instruction.dto';

@Controller("api")
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('instructions')
  async getInstructions() {
    return this.appService.getInstructions();
  }

  @Post('instructions')
  async createInstruction(@Body() createInstructionDto: CreateInstructionDto) {
    return this.appService.createInstruction(createInstructionDto);
  }
}
