import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Subscriber } from '../../subscriber/entities/subscriber.entity';
import { columnSize } from '../../../common/constants/columnSize';
import { BaseModel } from '../../../common/models/base.model';
import { ContactDetail } from './contact-detail.entity';

@Entity('users')
export class User extends BaseModel {
  @Column({ length: columnSize.regular_64 })
  name: string;
  @Column({
    length: columnSize.regular_64,
    unique: true,
    transformer: {
      from: (value: string) => value,
      // normalize username
      to: (value: string) => value.toLowerCase().trim(),
    },
  })
  username: string;
  @Column({ length: columnSize.regular_64 })
  password: string;
  @Column({ length: columnSize.small_16, nullable: true })
  profileImage?: string;
  @Column({ default: false })
  isActive?: boolean;
  @Column({ default: true })
  firstTimeLogin?: boolean;
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  lastLogin?: Date;
  @ManyToOne(() => Subscriber, (subscriber) => subscriber.users)
  @JoinColumn()
  subscriber?: Subscriber;

  @OneToOne(() => ContactDetail, (contactDetail) => contactDetail.user, { nullable: false })
  @JoinColumn()
  contactDetail: ContactDetail;
}
