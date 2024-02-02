import { ViewColumn, ViewEntity } from 'typeorm';
import { Author } from '../../catalogs/types';

@ViewEntity({
  expression: `select 'books' as entity, bk.id, bk.title, bk."coverImageId" , bk."typeId", to_jsonb(bk.author) as author, ARRAY[]::varchar[]  as judges, bk."publicationDate", bk."keyWords", null as "jurisdiction"   from "${process.env.STAGE}-books" bk
union
select 'articles' as entity, ar.id, ar.title, ar."coverImageId", ar."typeId", to_jsonb(ar.author) as author, ARRAY[]::varchar[]  as judges, ar."publicationDate", ar."keyWords", null as "jurisdiction"   from "${process.env.STAGE}-articles" ar
union
select 'case-studies' as entity, cs.id, cs.title, cs."coverImageId", cs."typeId", null as author, cs.judges, cs."publicationDate", cs."keyWords", null as "jurisdiction"   from "${process.env.STAGE}-case-studies" cs
union
select 'legislation' as entity, le.id, le.title, le."coverImageId", le."typeId", null as author, ARRAY[]::varchar[]  as judges, le."publicationDate", le."keyWords", le."jurisdiction"   from "${process.env.STAGE}-legislation" le`,
})
export class Search {
  @ViewColumn()
  entity: string;

  @ViewColumn()
  id: string;

  @ViewColumn()
  title: string;

  @ViewColumn()
  coverImageId: string;

  @ViewColumn()
  typeId: string;

  @ViewColumn()
  author?: Author;

  @ViewColumn()
  judges?: Array<string>;

  @ViewColumn()
  publicationDate?: Date;

  @ViewColumn()
  keyWords?: string;

  @ViewColumn()
  jurisdiction?: string;
}
