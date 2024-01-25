import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
export class CreateLegislationInput {
  @IsString()
  @IsNotEmpty({ message: 'Legislation title is required' })
  title: string;

  @IsString()
  coverImage?: string;

  @IsString()
  @IsNotEmpty({ message: 'Legislation summary is required' })
  summary: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Legislation type is required' })
  type: string;

  @IsString()
  jurisdiction: string;

  @IsDate()
  @IsNotEmpty({ message: 'Legislation publication date is required' })
  publicationDate: Date;

  @IsUUID()
  @IsNotEmpty({ message: 'File is required' })
  file: string;

  keywords?: string;

  @IsBoolean()
  status: boolean;
}
