import { IsNotEmpty, IsString } from 'class-validator';

export class OrganizationTypeInput {
  @IsString()
  @IsNotEmpty({ message: 'Organization Type name is required' })
  name: string;
  @IsString()
  description?: string;
}
