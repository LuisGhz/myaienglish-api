import { IsString, MaxLength, IsOptional } from 'class-validator';

export class UpdateInstructionDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  content?: string;
}
