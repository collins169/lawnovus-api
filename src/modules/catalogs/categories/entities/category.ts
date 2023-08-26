import { Column, Entity, Unique } from 'typeorm';
import { BaseModelWithCreatedBy } from '../../../../common/models/baseWithCreatedBy.model';
import { CategoryTypeEnum } from '../../types';
import { columnSize } from '../../../../common/constants/columnSize';

@Entity('category')
@Unique(['type', 'name'])
export class Category extends BaseModelWithCreatedBy {
  @Column({ type: 'simple-enum', enum: CategoryTypeEnum })
  type: CategoryTypeEnum;
  @Column({ length: columnSize.regular_64, nullable: false })
  name: string;
  @Column({ length: columnSize.regular_64, nullable: true })
  description?: string;
}
