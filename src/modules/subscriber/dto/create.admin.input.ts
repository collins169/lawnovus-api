import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { ContactDetailInput } from '../../auth/dto/contact-detail.input';

export class CreateAdminInput {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Transform(({ obj }) => obj.username.toLowerCase().trim())
  username: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @Type(() => ContactDetailInput)
  @ValidateNested()
  contactDetail: ContactDetailInput;
}
