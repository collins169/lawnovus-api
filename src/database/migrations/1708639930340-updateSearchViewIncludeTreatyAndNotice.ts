import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSearchViewIncludeTreatyAndNotice1708639930340 implements MigrationInterface {
  name = 'UpdateSearchViewIncludeTreatyAndNotice1708639930340';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            DELETE FROM "typeorm_metadata"
            WHERE "type" = $1
                AND "name" = $2
                AND "schema" = $3
        `,
      ['VIEW', `${process.env.STAGE}-search`, 'public'],
    );
    await queryRunner.query(`
            DROP VIEW "${process.env.STAGE}-search"
        `);
    await queryRunner.query(`
            CREATE VIEW "${process.env.STAGE}-search" AS
            select 'books' as entity,
                bk.id,
                bk.title,
                bk."coverImageId",
                bk."typeId",
                to_jsonb(bk.author) as author,
                ARRAY []::varchar [] as judges,
                bk."publicationDate",
                bk."keyWords",
                null as "jurisdiction"
            from "${process.env.STAGE}-books" bk
            union
            select 'articles' as entity,
                ar.id,
                ar.title,
                ar."coverImageId",
                ar."typeId",
                to_jsonb(ar.author) as author,
                ARRAY []::varchar [] as judges,
                ar."publicationDate",
                ar."keyWords",
                null as "jurisdiction"
            from "${process.env.STAGE}-articles" ar
            union
            select 'case-studies' as entity,
                cs.id,
                cs.title,
                cs."coverImageId",
                cs."typeId",
                null as author,
                cs.judges,
                cs."publicationDate",
                cs."keyWords",
                null as "jurisdiction"
            from "${process.env.STAGE}-case-studies" cs
            union
            select 'legislation' as entity,
                le.id,
                le.title,
                le."coverImageId",
                le."typeId",
                null as author,
                ARRAY []::varchar [] as judges,
                le."publicationDate",
                le."keyWords",
                le."jurisdiction"
            from "${process.env.STAGE}-legislation" le
            union
            select 'notices' as entity,
                no.id,
                no.title,
                null as coverImageId,
                no."typeId",
                null as author,
                ARRAY []::varchar [] as judges,
                no."publicationDate",
                no."keyWords",
                no."jurisdiction"
            from "${process.env.STAGE}-notices" no
            union
            select 'treaties' as entity,
                tr.id,
                tr.title,
                null as coverImageId,
                tr."typeId",
                null as author,
                ARRAY []::varchar [] as judges,
                tr."publicationDate",
                tr."keyWords",
                null as jurisdiction
            from "${process.env.STAGE}-treaties" tr
        `);
    await queryRunner.query(
      `
            INSERT INTO "typeorm_metadata"(
                    "database",
                    "schema",
                    "table",
                    "type",
                    "name",
                    "value"
                )
            VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)
        `,
      [
        'public',
        'VIEW',
        `${process.env.STAGE}-search`,
        `select 'books' as entity, bk.id, bk.title, bk.\"coverImageId\" , bk.\"typeId\", to_jsonb(bk.author) as author, ARRAY[]::varchar[]  as judges, bk.\"publicationDate\", bk.\"keyWords\", null as \"jurisdiction\"   from \"${process.env.STAGE}-books\" bk\nunion\nselect 'articles' as entity, ar.id, ar.title, ar.\"coverImageId\", ar.\"typeId\", to_jsonb(ar.author) as author, ARRAY[]::varchar[]  as judges, ar.\"publicationDate\", ar.\"keyWords\", null as \"jurisdiction\"   from \"${process.env.STAGE}-articles\" ar\nunion\nselect 'case-studies' as entity, cs.id, cs.title, cs.\"coverImageId\", cs.\"typeId\", null as author, cs.judges, cs.\"publicationDate\", cs.\"keyWords\", null as \"jurisdiction\"   from \"${process.env.STAGE}-case-studies\" cs\nunion\nselect 'legislation' as entity, le.id, le.title, le.\"coverImageId\", le.\"typeId\", null as author, ARRAY[]::varchar[]  as judges, le.\"publicationDate\", le.\"keyWords\", le.\"jurisdiction\"   from \"${process.env.STAGE}-legislation\" le\nunion\nselect 'notices' as entity, no.id, no.title, null as coverImageId, no.\"typeId\", null as author, ARRAY[]::varchar[]  as judges, no.\"publicationDate\", no.\"keyWords\", no.\"jurisdiction\"  from \"${process.env.STAGE}-notices\" no\nunion\nselect 'treaties' as entity, tr.id, tr.title, null as coverImageId, tr.\"typeId\", null as author, ARRAY[]::varchar[]  as judges, tr.\"publicationDate\", tr.\"keyWords\", null as jurisdiction   from \"${process.env.STAGE}-treaties\" tr`,
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            DELETE FROM "typeorm_metadata"
            WHERE "type" = $1
                AND "name" = $2
                AND "schema" = $3
        `,
      ['VIEW', `${process.env.STAGE}-search`, 'public'],
    );
    await queryRunner.query(`
            DROP VIEW "${process.env.STAGE}-search"
        `);
    await queryRunner.query(`
            CREATE VIEW "${process.env.STAGE}-search" AS
            select 'books' as entity,
                bk.id,
                bk.title,
                bk."coverImageId",
                bk."typeId",
                to_jsonb(bk.author) as author,
                ARRAY []::varchar [] as judges,
                bk."publicationDate",
                bk."keyWords",
                null as "jurisdiction"
            from "${process.env.STAGE}-books" bk
            union
            select 'articles' as entity,
                ar.id,
                ar.title,
                ar."coverImageId",
                ar."typeId",
                to_jsonb(ar.author) as author,
                ARRAY []::varchar [] as judges,
                ar."publicationDate",
                ar."keyWords",
                null as "jurisdiction"
            from "${process.env.STAGE}-articles" ar
            union
            select 'case-studies' as entity,
                cs.id,
                cs.title,
                cs."coverImageId",
                cs."typeId",
                null as author,
                cs.judges,
                cs."publicationDate",
                cs."keyWords",
                null as "jurisdiction"
            from "${process.env.STAGE}-case-studies" cs
            union
            select 'legislation' as entity,
                le.id,
                le.title,
                le."coverImageId",
                le."typeId",
                null as author,
                ARRAY []::varchar [] as judges,
                le."publicationDate",
                le."keyWords",
                le."jurisdiction"
            from "${process.env.STAGE}-legislation" le
        `);
    await queryRunner.query(
      `
            INSERT INTO "typeorm_metadata"(
                    "database",
                    "schema",
                    "table",
                    "type",
                    "name",
                    "value"
                )
            VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)
        `,
      [
        'public',
        'VIEW',
        `${process.env.STAGE}-search`,
        `select 'books' as entity, bk.id, bk.title, bk.\"coverImageId\" , bk.\"typeId\", to_jsonb(bk.author) as author, ARRAY[]::varchar[]  as judges, bk.\"publicationDate\", bk.\"keyWords\", null as \"jurisdiction\"   from \"${process.env.STAGE}-books\" bk\nunion\nselect 'articles' as entity, ar.id, ar.title, ar.\"coverImageId\", ar.\"typeId\", to_jsonb(ar.author) as author, ARRAY[]::varchar[]  as judges, ar.\"publicationDate\", ar.\"keyWords\", null as \"jurisdiction\"   from \"${process.env.STAGE}-articles\" ar\nunion\nselect 'case-studies' as entity, cs.id, cs.title, cs.\"coverImageId\", cs.\"typeId\", null as author, cs.judges, cs.\"publicationDate\", cs.\"keyWords\", null as \"jurisdiction\"   from \"${process.env.STAGE}-case-studies\" cs\nunion\nselect 'legislation' as entity, le.id, le.title, le.\"coverImageId\", le.\"typeId\", null as author, ARRAY[]::varchar[]  as judges, le.\"publicationDate\", le.\"keyWords\", le.\"jurisdiction\"   from \"${process.env.STAGE}-legislation\" le`,
      ],
    );
  }
}
