import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseModelWithCreatedBy } from '../../../../common/models/baseWithCreatedBy.model';
import { columnSize } from '../../../../common/constants/columnSize';
import { Author } from '../../types';
import { Document } from '../../../documents/entities/document.entity';
import { Category } from '../../categories/entities/category';

@Entity('articles')
export class Article extends BaseModelWithCreatedBy {
  @Column({ length: columnSize.large_512, nullable: false, unique: true })
  title: string;

  @OneToOne(() => Document)
  @JoinColumn()
  coverImage: Document;

  @Column({ type: 'text' })
  summary: string;

  @ManyToOne(() => Category)
  @JoinColumn()
  type: Category;

  @Column({ type: 'json', nullable: true })
  author?: Author;

  @Column({ type: 'timestamp with time zone' })
  publicationDate: Date;

  @OneToOne(() => Document)
  @JoinColumn()
  file: Document;

  @Column({ length: columnSize.regular_64, nullable: true })
  language?: string;

  @Column({ default: 0, nullable: true })
  isbn?: number;

  @Column({ default: 0, nullable: true })
  rating?: number;

  @Column({ default: 0, nullable: true })
  pages?: number;

  @Column({ default: true, nullable: true })
  isActive?: boolean;

  @Column({ length: columnSize.large_512, nullable: true })
  keyWords?: string;

  @Column({ type: 'json', nullable: true })
  metaData?: Record<string, unknown>;
}
