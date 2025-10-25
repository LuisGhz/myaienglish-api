import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateInstructionDto } from './dtos/instructions/create-instruction.dto';
import { UpdateInstructionDto } from './dtos/instructions/update-instruction.dto';
import { TranslateTextReqDto } from './dtos/translate/translate-text.req.dto';

@Controller("api")
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('translate')
  async translate(@Body() body: TranslateTextReqDto) {
    return this.appService.translateText(body);
  }

  @Get('instructions')
  async getInstructions() {
    return this.appService.getInstructions();
  }

  @Post('instructions')
  async createInstruction(@Body() createInstructionDto: CreateInstructionDto) {
    return this.appService.createInstruction(createInstructionDto);
  }

  @Patch('instructions/:id/update')
  async updateInstruction(
    @Param('id') id: string,
    @Body() updateInstructionDto: UpdateInstructionDto,
  ) {
    return this.appService.updateInstruction(id, updateInstructionDto);
  }

  @Delete('instructions/:id/delete')
  async deleteInstruction(@Param('id') id: string) {
    return this.appService.deleteInstruction(id);
  }
}
