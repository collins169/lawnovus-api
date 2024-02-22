import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseModelWithCreatedBy } from '../../../../common/models/baseWithCreatedBy.model';
import { columnSize } from '../../../../common/constants/columnSize';
import { Document } from '../../../documents/entities/document.entity';
import { Category } from '../../categories/entities/category';

@Entity('treaties')
export class Treaty extends BaseModelWithCreatedBy {
  @Column({ length: columnSize.large_512, nullable: false, unique: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  summary?: string;

  @ManyToOne(() => Category)
  @JoinColumn()
  type: Category;

  @Column({ type: 'timestamp with time zone' })
  publicationDate: Date;

  @OneToOne(() => Document)
  @JoinColumn()
  file: Document;

  @Column('text', { array: true, default: [] })
  jurisdictions?: Array<string>;

  @Column({ default: 0, nullable: true })
  rating?: number;

  @Column({ default: true, nullable: true })
  isActive?: boolean;

  @Column({ length: columnSize.large_512, nullable: true })
  keyWords?: string;

  @Column({ type: 'json', nullable: true })
  metaData?: Record<string, unknown>;
}
