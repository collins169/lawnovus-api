import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterColumnSize1706482873406 implements MigrationInterface {
  name = 'AlterColumnSize1706482873406';

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
            ALTER TABLE "${process.env.STAGE}-documents"
            ALTER COLUMN "name" TYPE character varying(512)
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-documents"
            ALTER COLUMN "key" TYPE character varying(512)
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-case-studies"
            ALTER COLUMN "title" TYPE character varying(512)
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-case-studies"
            ALTER COLUMN "keyWords" TYPE character varying(512) 
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-articles"
            ALTER COLUMN "title" TYPE character varying(512)
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-articles"
            ALTER COLUMN "keyWords" TYPE character varying(512) 
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-legislation"
            ALTER COLUMN "title" TYPE character varying(512)
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-legislation"
            ALTER COLUMN "keyWords" TYPE character varying(512) 
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-books"
            ALTER COLUMN "title" TYPE character varying(512)
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-books"
            ALTER COLUMN "keyWords" TYPE character varying(512) 
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-books"
            ALTER COLUMN "keyWords" TYPE character varying(64) 
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-books"
						ALTER COLUMN "title" TYPE character varying(64) 
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-legislation"
            ALTER COLUMN "keyWords" TYPE character varying(64) 
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-legislation"
            ALTER COLUMN "title" TYPE character varying(64) 
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-articles"
            ALTER COLUMN "keyWords" TYPE character varying(64) 
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-articles"
            ALTER COLUMN "title" TYPE character varying(64) 
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-case-studies"
            ALTER COLUMN "keyWords" TYPE character varying(64) 
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-case-studies"
            ALTER COLUMN "title" TYPE character varying(64) 
        `);

    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-documents"
            ALTER COLUMN "name" TYPE character varying(64)
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-documents"
            ALTER COLUMN "key" TYPE character varying(64)
        `);

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
                bk."publicationDate"
            from "${process.env.STAGE}-books" bk
            union
            select 'articles' as entity,
                ar.id,
                ar.title,
                ar."coverImageId",
                ar."typeId",
                to_jsonb(ar.author) as author,
                ARRAY []::varchar [] as judge,
                ar."publicationDate"
            from "${process.env.STAGE}-articles" ar
            union
            select 'case-studies' as entity,
                cs.id,
                cs.title,
                cs."coverImageId",
                cs."typeId",
                null as author,
                cs.judges,
                cs."publicationDate"
            from "${process.env.STAGE}-case-studies" cs
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
        `select 'books' as entity, bk.id, bk.title, bk.\"coverImageId\" , bk.\"typeId\", to_jsonb(bk.author) as author, ARRAY[]::varchar[]  as judges, bk.\"publicationDate\"  from \"${process.env.STAGE}-books\" bk\nunion\nselect 'articles' as entity, ar.id, ar.title, ar.\"coverImageId\", ar.\"typeId\", to_jsonb(ar.author) as author, ARRAY[]::varchar[]  as judge, ar.\"publicationDate\"   from \"${process.env.STAGE}-articles\" ar\nunion\nselect 'case-studies' as entity, cs.id, cs.title, cs.\"coverImageId\", cs.\"typeId\", null as author, cs.judges, cs.\"publicationDate\"   from \"${process.env.STAGE}-case-studies\" cs`,
      ],
    );
  }
}
