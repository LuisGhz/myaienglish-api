import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { PasswordMatch } from '../validators';

@PasswordMatch()
export class RegisterReqDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @IsString()
  confirmPassword: string;
}
