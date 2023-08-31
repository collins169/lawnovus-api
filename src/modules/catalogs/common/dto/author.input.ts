import { IsString } from 'class-validator';

export class AuthorInput {
  @IsString()
  name: string;

  @IsString()
  bio: string;
}
