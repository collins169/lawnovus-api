import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { GenderEnum } from '../../users/types/user.types';

export class ContactDetailInput {
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ obj }) => obj.email.toLowerCase().trim())
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsString()
  address: string;

  @IsEnum(GenderEnum, {
    message: `$property must be one of: ${Object.values(GenderEnum).join(', ')}`,
  })
  gender?: GenderEnum;
}
