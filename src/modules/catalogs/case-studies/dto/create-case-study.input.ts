import { IsArray, IsDate, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
export class CreateCaseStudyInput {
  @IsString()
  @IsNotEmpty({ message: 'Case title is required' })
  title: string;

  @IsString()
  coverImage?: string;

  @IsString()
  @IsNotEmpty({ message: 'Case summary is required' })
  summary: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Case type is required' })
  type: string;

  @IsArray()
  judges?: Array<string>;

  @IsString()
  court: string;

  @IsDate()
  @IsNotEmpty({ message: 'Case publication date is required' })
  publicationDate: Date;

  @IsUUID()
  @IsNotEmpty({ message: 'File is required' })
  file: string;

  @IsString()
  language?: string;

  @IsNumber()
  isbn: number;

  keyWords?: string;

  @IsNumber()
  pages: number;
}
