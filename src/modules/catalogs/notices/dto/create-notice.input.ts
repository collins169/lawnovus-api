import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateNoticeInput {
  @IsString()
  @IsNotEmpty({ message: 'Notice title is required' })
  title: string;

  @IsString()
  summary?: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Notice type is required' })
  type: string;

  @IsDate()
  @IsNotEmpty({ message: 'Notice date is required' })
  publicationDate: Date;

  @IsUUID()
  @IsNotEmpty({ message: 'File is required' })
  file: string;

  @IsString()
  jurisdiction?: string;

  @IsString()
  keyWords?: string;
}
