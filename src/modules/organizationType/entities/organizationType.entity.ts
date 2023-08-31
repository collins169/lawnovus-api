import { Column, Entity, Unique } from 'typeorm';
import { columnSize } from '../../../common/constants/columnSize';
import { BaseModel } from '../../../common/models/base.model';

@Entity('organization-type')
@Unique(['name', 'deletedAt'])
export class OrganizationType extends BaseModel {
  @Column({ length: columnSize.regular_64 })
  name: string;
  @Column({ length: columnSize.large_512 })
  description?: string;
  @Column({ default: true })
  isActive: boolean;
}
