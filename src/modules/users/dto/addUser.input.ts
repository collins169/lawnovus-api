// import { Transform, Type } from 'class-transformer';
// import {
//   ArrayMaxSize,
//   ArrayMinSize,
//   IsArray,
//   IsEmail,
//   IsPhoneNumber,
//   IsString,
//   Matches,
//   MaxLength,
//   MinLength,
//   ValidateNested,
// } from 'class-validator';
// import { GenderEnum, UserRole } from '../types/user.types';
// import { CountryCode } from 'libphonenumber-js';
// import { UserLocationInput } from './userLocation.input';

// const { COUNTRY_CODE } = process.env;

// export class AddUserInput {
//   @IsEmail()
//   @Transform(({ obj }) => obj.email.toLowerCase().trim())
//   email: string;

//   @IsString()
//   @MinLength(4)
//   @MaxLength(20)
//   @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
//   password: string;

//   @IsString()
//   firstName: string;

//   @IsString()
//   lastName: string;

//   @IsPhoneNumber(COUNTRY_CODE as CountryCode, { message: `invalid phone number, ${COUNTRY_CODE} are allowed` })
//   phone: string;

//   @IsPhoneNumber(COUNTRY_CODE as CountryCode, { message: `invalid phone number, ${COUNTRY_CODE} are allowed` })
//   alternatePhone?: string;

//   @Matches(
//     `^${Object.values(UserRole)
//       .filter((v) => typeof v !== 'number')
//       .join('|')}$`,
//     'i',
//   )
//   role: UserRole;

//   @Matches(
//     `^${Object.values(GenderEnum)
//       .filter((v) => typeof v !== 'number')
//       .join('|')}$`,
//     'i',
//   )
//   gender: GenderEnum;

//   @IsArray()
//   @ValidateNested({ each: true })
//   @ArrayMinSize(1)
//   @ArrayMaxSize(5)
//   @Type(() => UserLocationInput)
//   locations: UserLocationInput[];
// }
