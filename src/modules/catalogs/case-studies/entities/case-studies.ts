import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseModelWithCreatedBy } from '../../../../common/models/baseWithCreatedBy.model';
import { columnSize } from '../../../../common/constants/columnSize';
import { Author } from '../../types';
import { Document } from '../../../documents/entities/document.entity';
import { Category } from '../../categories/entities/category';

@Entity('case-studies')
export class CaseStudy extends BaseModelWithCreatedBy {
  @Column({ length: columnSize.regular_64, nullable: false, unique: true })
  title: string;

  @OneToOne(() => Document)
  @JoinColumn()
  coverImage?: Document;

  @Column({ type: 'text' })
  summary: string;

  @ManyToOne(() => Category)
  @JoinColumn()
  type: Category;

  @Column('text', { array: true, default: [] })
  judges?: Array<string>;

  @Column({ length: columnSize.regular_64, nullable: true })
  court?: string;

  @Column({ type: 'timestamp with time zone' })
  publicationDate: Date;

  @OneToOne(() => Document)
  @JoinColumn()
  file: Document;

  @Column({ default: 0, nullable: true })
  isbn?: number;

  @Column({ default: 0, nullable: true })
  rating?: number;

  @Column({ default: 0, nullable: true })
  pages?: number;

  @Column({ default: true, nullable: true })
  isActive?: boolean;

  @Column({ length: columnSize.regular_64, nullable: true })
  keyWords?: string;

  @Column({ type: 'json', nullable: true })
  metaData?: Record<string, unknown>;
}
