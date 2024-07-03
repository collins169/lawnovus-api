import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, IsUUID, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { ContactDetailInput } from '../../auth/dto/contact-detail.input';

export class UpdateSubscriberUserInput {
  @IsUUID()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @Type(() => ContactDetailInput)
  @ValidateNested()
  contactDetail: ContactDetailInput;

  @IsBoolean()
  status: boolean;
}
