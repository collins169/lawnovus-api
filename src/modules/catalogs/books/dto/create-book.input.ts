import { IsDate, IsNotEmpty, IsNumber, IsString, IsUUID, ValidateNested } from 'class-validator';
import { AuthorInput } from '../../common/dto/author.input';
import { Type } from 'class-transformer';

export class CreateBookInput {
  @IsString()
  @IsNotEmpty({ message: 'Book title is required' })
  title: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Cover image is required' })
  coverImage: string;

  @IsString()
  @IsNotEmpty({ message: 'Book summary is required' })
  summary: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Book type is required' })
  type: string;

  @Type(() => AuthorInput)
  @ValidateNested()
  author: AuthorInput;

  @IsDate()
  @IsNotEmpty({ message: 'Book publication date is required' })
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
