import { JoinColumn, ManyToOne } from 'typeorm';
import { BaseModel } from './base.model';
import { Administrator } from '../../modules/admin/entities/administrator.entity';

export class BaseModelWithCreatedBy extends BaseModel {
  @ManyToOne(() => Administrator)
  @JoinColumn({ name: 'createdBy' })
  createdBy: Administrator;
  @ManyToOne(() => Administrator, { nullable: true })
  @JoinColumn({ name: 'updatedBy' })
  updatedBy?: Administrator;
}
