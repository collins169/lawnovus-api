import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class changePasswordInput {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password: string;
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
  confirmPassword: string;
}
