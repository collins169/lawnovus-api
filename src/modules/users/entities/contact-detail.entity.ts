import { Column, Entity, OneToOne } from 'typeorm';
import { columnSize } from '../../../common/constants/columnSize';
import { User } from './user.entity';
import { BaseModel } from '../../../common/models/base.model';

@Entity('contact-detail')
export class ContactDetail extends BaseModel {
  @OneToOne(() => User, (user) => user.contactDetail) // specify inverse side as a second parameter
  user: User;
  @Column({ default: false })
  isContactPerson: boolean;
  @Column({ length: columnSize.regular_64 })
  name: string;
  @Column({
    length: columnSize.regular_64,
    unique: true,
    transformer: {
      from: (value: string) => value,
      // normalize email
      to: (value: string) => value.toLowerCase().trim(),
    },
  })
  email: string;
  @Column({ length: columnSize.regular_64, unique: true })
  phone: string;
  @Column({ length: columnSize.regular_64 })
  address: string;
}
