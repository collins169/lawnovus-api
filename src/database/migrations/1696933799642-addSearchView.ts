import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSearchView1696933799642 implements MigrationInterface {
  name = 'AddSearchView1696933799642';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE VIEW "${process.env.STAGE}-search" AS
            select 'books' as entity,
                bk.id,
                bk.title,
                bk."coverImageId",
                bk."typeId",
                to_jsonb(bk.author) as author,
                null as judge,
                ARRAY []::varchar [] as lawyers,
                bk."publicationDate"
            from "${process.env.STAGE}-books" bk
            union
            select 'articles' as entity,
                ar.id,
                ar.title,
                ar."coverImageId",
                ar."typeId",
                to_jsonb(ar.author) as author,
                null as judge,
                ARRAY []::varchar [] as lawyers,
                ar."publicationDate"
            from "${process.env.STAGE}-articles" ar
            union
            select 'case-studies' as entity,
                cs.id,
                cs.title,
                cs."coverImageId",
                cs."typeId",
                null as author,
                cs.judge,
                cs.lawyers,
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
        `select 'books' as entity, bk.id, bk.title, bk.\"coverImageId\" , bk.\"typeId\", to_jsonb(bk.author) as author, null as judge, ARRAY[]::varchar[] as lawyers, bk.\"publicationDate\"  from \"${process.env.STAGE}-books\" bk\nunion\nselect 'articles' as entity, ar.id, ar.title, ar.\"coverImageId\", ar.\"typeId\", to_jsonb(ar.author) as author, null as judge, ARRAY[]::varchar[] as lawyers, ar.\"publicationDate\"   from \"${process.env.STAGE}-articles\" ar\nunion\nselect 'case-studies' as entity, cs.id, cs.title, cs.\"coverImageId\", cs.\"typeId\", null as author, cs.judge, cs.lawyers, cs.\"publicationDate\"   from \"${process.env.STAGE}-case-studies\" cs`,
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
  }
}
