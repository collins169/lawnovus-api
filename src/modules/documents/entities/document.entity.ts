import { Column, Entity } from 'typeorm';
import { BaseModelWithCreatedBy } from '../../../common/models/baseWithCreatedBy.model';
import { columnSize } from '../../../common/constants/columnSize';

@Entity('documents')
export class Document extends BaseModelWithCreatedBy {
  @Column({ length: columnSize.large_512, nullable: false })
  name: string;
  @Column({ length: columnSize.regular_64, nullable: false })
  fileType: string;
  @Column({ length: columnSize.regular_64, nullable: false })
  mimeType: string;
  @Column()
  size: string;
  @Column({ length: columnSize.large_512, nullable: false, unique: true })
  key: string;
  @Column({ type: 'json' })
  metaData?: Record<string, any>;
}
