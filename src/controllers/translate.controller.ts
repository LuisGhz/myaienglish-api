import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { AddFavTranslationReqDto } from "src/dtos/translate/add-fav-translation.req.dto";
import { TranslateTextReqDto } from "src/dtos/translate/translate-text.req.dto";
import { TranslateService } from "src/services";

@Controller('api/translate')
export class TranslateController {

  constructor(private translateService: TranslateService) { }

  @Post()
  async translate(@Body() body: TranslateTextReqDto) {
    return this.translateService.translateText(body);
  }

  @Get('favorites')
  async getFavTranslations() {
    return this.translateService.getFavTranslations();
  }

  @Post('favorites')
  async addFavTranslation(@Body() body: AddFavTranslationReqDto) {
    return this.translateService.addFavTranslation(body);
  }

  @Delete('favorites/:id/delete')
  async deleteFavTranslation(@Param('id') id: string) {
    return this.translateService.deleteFavTranslation(id);
  }
}