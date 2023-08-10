import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthUserInput {
  @IsString()
  @Transform(({ obj }) => obj.username.toLowerCase().trim())
  username: string;
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password: string;
}
