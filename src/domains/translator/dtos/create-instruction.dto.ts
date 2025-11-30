import { IsString, MaxLength } from 'class-validator';

export class CreateInstructionDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @MaxLength(200)
  content: string;
}
