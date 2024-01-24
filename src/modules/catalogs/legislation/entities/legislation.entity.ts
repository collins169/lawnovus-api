import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseModelWithCreatedBy } from '../../../../common/models/baseWithCreatedBy.model';
import { columnSize } from '../../../../common/constants/columnSize';
import { Author } from '../../types';
import { Document } from '../../../documents/entities/document.entity';
import { Category } from '../../categories/entities/category';

@Entity('legislation')
export class Legislation extends BaseModelWithCreatedBy {
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

  @Column({ length: columnSize.regular_64, nullable: true })
  jurisdiction?: string;

  @Column({ type: 'timestamp with time zone' })
  publicationDate: Date;

  @OneToOne(() => Document)
  @JoinColumn()
  file: Document;

  @Column({ default: true, nullable: true })
  status?: boolean;

  @Column({ type: 'json', nullable: true })
  metaData?: Record<string, unknown>;
}
