import { IsArray, IsDate, IsNotEmpty, IsNumber, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AuthorInput } from '../../common/dto/author.input';

export class CreateCaseStudyInput {
  @IsString()
  @IsNotEmpty({ message: 'Article title is required' })
  title: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Cover image is required' })
  coverImage: string;

  @IsString()
  @IsNotEmpty({ message: 'Article summary is required' })
  summary: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Article type is required' })
  type: string;

  @IsString()
  judge: string;

  @IsArray()
  lawyers?: Array<string>;

  @IsString()
  court: string;

  @IsDate()
  @IsNotEmpty({ message: 'Article publication date is required' })
  publicationDate: Date;

  @IsUUID()
  @IsNotEmpty({ message: 'File is required' })
  file: string;

  @IsString()
  language: string;

  @IsNumber()
  isbn: number;

  @IsNumber()
  pages: number;
}
