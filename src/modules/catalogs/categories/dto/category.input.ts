import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CategoryTypeEnum } from '../../types';

export class CategoryTypeInput {
  @IsEnum(CategoryTypeEnum, {
    message: `$property must be one of: ${Object.values(CategoryTypeEnum).join(', ')}`,
  })
  type: CategoryTypeEnum;
  @IsString()
  @IsNotEmpty({ message: 'Category name is required' })
  name: string;
  @IsString()
  description?: string;
}
