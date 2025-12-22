import { IsEmail, IsString, MaxLength } from 'class-validator';

export class LoginReqDto {
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @MaxLength(100)
  password: string;
}

export class LoginResDto {
  accessToken: string;
}
