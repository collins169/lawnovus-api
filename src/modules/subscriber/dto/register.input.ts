import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { SubscriberTypes } from '../../users/types/user.types';
import { ContactDetailInput } from '../../auth/dto/contact-detail.input';

export class RegisterInput {
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

  @IsEnum(SubscriberTypes, {
    message: `$property must be one of: ${Object.values(SubscriberTypes).join(', ')}`,
  })
  subscriberType: SubscriberTypes;

  @ValidateIf((val) => val.subscriberType === SubscriberTypes.INSTITUTIONAL)
  @IsNotEmpty()
  @IsPhoneNumber()
  institutionPhone?: string;

  @ValidateIf((val) => val.subscriberType === SubscriberTypes.INSTITUTIONAL)
  @IsNotEmpty()
  @IsString()
  institutionAddress?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @ValidateIf((val) => val.subscriberType === SubscriberTypes.INSTITUTIONAL)
  @IsNotEmpty()
  @IsUUID()
  organizationTypeId: string;

  @Type(() => ContactDetailInput)
  @ValidateNested()
  contactDetail: ContactDetailInput;
}
