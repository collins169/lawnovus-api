import { IsDate, IsNotEmpty, IsString, IsUUID, IsArray } from 'class-validator';

export class CreateTreatyInput {
  @IsString()
  @IsNotEmpty({ message: 'Treaty title is required' })
  title: string;

  @IsString()
  summary?: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Treaty type is required' })
  type: string;

  @IsDate()
  @IsNotEmpty({ message: 'Treaty date is required' })
  publicationDate: Date;

  @IsUUID()
  @IsNotEmpty({ message: 'File is required' })
  file: string;

  @IsArray()
  jurisdictions?: Array<string>;

  @IsString()
  keyWords?: string;
}
