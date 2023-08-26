import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookTable1693001090306 implements MigrationInterface {
  name = 'AddBookTable1693001090306';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "${process.env.STAGE}-books" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "title" character varying(64) NOT NULL,
                "summary" text NOT NULL,
                "author" json,
                "publicationDate" TIMESTAMP WITH TIME ZONE NOT NULL,
                "language" character varying(64),
                "isbn" integer DEFAULT '0',
                "rating" integer DEFAULT '0',
                "pages" integer DEFAULT '0',
                "isActive" boolean DEFAULT true,
                "metaData" json,
                "createdBy" uuid,
                "updatedBy" uuid,
                "coverImageId" uuid,
                "typeId" uuid,
                "fileId" uuid,
                CONSTRAINT "UQ_05480a733b8332b21cccc93ddaa" UNIQUE ("title"),
                CONSTRAINT "REL_0115d430d023ddb74828da6ff4" UNIQUE ("coverImageId"),
                CONSTRAINT "REL_721197c2030b0d7882bf362409" UNIQUE ("fileId"),
                CONSTRAINT "pk-${process.env.STAGE}_books" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-books"
            ADD CONSTRAINT "fk-${process.env.STAGE}_books-createdBy" FOREIGN KEY ("createdBy") REFERENCES "${process.env.STAGE}-administrators"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-books"
            ADD CONSTRAINT "fk-${process.env.STAGE}_books-updatedBy" FOREIGN KEY ("updatedBy") REFERENCES "${process.env.STAGE}-administrators"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-books"
            ADD CONSTRAINT "fk-${process.env.STAGE}_books-coverImageId" FOREIGN KEY ("coverImageId") REFERENCES "${process.env.STAGE}-documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-books"
            ADD CONSTRAINT "fk-${process.env.STAGE}_books-typeId" FOREIGN KEY ("typeId") REFERENCES "${process.env.STAGE}-category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-books"
            ADD CONSTRAINT "fk-${process.env.STAGE}_books-fileId" FOREIGN KEY ("fileId") REFERENCES "${process.env.STAGE}-documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-books" DROP CONSTRAINT "fk-${process.env.STAGE}_books-fileId"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-books" DROP CONSTRAINT "fk-${process.env.STAGE}_books-typeId"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-books" DROP CONSTRAINT "fk-${process.env.STAGE}_books-coverImageId"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-books" DROP CONSTRAINT "fk-${process.env.STAGE}_books-updatedBy"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-books" DROP CONSTRAINT "fk-${process.env.STAGE}_books-createdBy"
        `);
    await queryRunner.query(`
            DROP TABLE "${process.env.STAGE}-books"
        `);
  }
}
