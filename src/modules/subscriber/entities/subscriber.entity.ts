import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { SubscriberTypes } from '../../users/types/user.types';
import { User } from '../../users/entities/user.entity';
import { columnSize } from '../../../common/constants/columnSize';
import { OrganizationType } from '../../organizationType/entities/organizationType.entity';
import { BaseModelWithCreatedBy } from '../../../common/models/baseWithCreatedBy.model';

@Entity('subscribers')
export class Subscriber extends BaseModelWithCreatedBy {
  @OneToMany(() => User, (user) => user.subscriber)
  users: User[];
  @Column({ length: columnSize.regular_64, unique: false })
  name: string;
  @Column({ type: 'simple-enum', enum: SubscriberTypes })
  type: SubscriberTypes;
  @OneToOne(() => OrganizationType)
  @JoinColumn()
  organizationType?: OrganizationType;
  @Column({ length: columnSize.regular_64, unique: false })
  phone?: string;
  @Column({ length: columnSize.regular_64 })
  address?: string;
  @Column({ default: false })
  isActive?: boolean;
}
