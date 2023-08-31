import { Transform, Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { ContactDetailInput } from '../../auth/dto/contact-detail.input';
import { AdministratorTypes } from '../../users/types/user.types';

export class AddAdminInput {
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

  @IsEnum(AdministratorTypes, {
    message: `$property must be one of: ${Object.values(AdministratorTypes).join(', ')}`,
  })
  role: AdministratorTypes;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @Type(() => ContactDetailInput)
  @ValidateNested()
  contactDetail: ContactDetailInput;
}
