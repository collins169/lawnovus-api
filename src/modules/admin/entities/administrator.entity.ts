import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AdministratorTypes } from '../../users/types/user.types';
import { User } from '../../users/entities/user.entity';
import { BaseModel } from '../../../common/models/base.model';

@Entity('administrators')
export class Administrator extends BaseModel {
  @OneToOne(() => User, { nullable: false })
  @JoinColumn()
  user: User;
  @Column({ type: 'simple-enum', enum: AdministratorTypes })
  type: AdministratorTypes;
}
