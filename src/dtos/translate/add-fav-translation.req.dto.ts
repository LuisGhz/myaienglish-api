import { IsString } from "class-validator";

export class AddFavTranslationReqDto {
  @IsString()
  originalText: string;
  @IsString()
  translatedText: string;
}