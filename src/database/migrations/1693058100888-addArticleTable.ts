import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddArticleTable1693058100888 implements MigrationInterface {
  name = 'AddArticleTable1693058100888';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "${process.env.STAGE}-articles" (
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
                CONSTRAINT "UQ_952defbae4d6673dd9f077d0921" UNIQUE ("title"),
                CONSTRAINT "REL_4ce4066f43da3f66437f1900f1" UNIQUE ("coverImageId"),
                CONSTRAINT "REL_5f6a3405ec2b3a424829dec046" UNIQUE ("fileId"),
                CONSTRAINT "pk-${process.env.STAGE}_articles" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-articles"
            ADD CONSTRAINT "fk-${process.env.STAGE}_articles-createdBy" FOREIGN KEY ("createdBy") REFERENCES "${process.env.STAGE}-administrators"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-articles"
            ADD CONSTRAINT "fk-${process.env.STAGE}_articles-updatedBy" FOREIGN KEY ("updatedBy") REFERENCES "${process.env.STAGE}-administrators"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-articles"
            ADD CONSTRAINT "fk-${process.env.STAGE}_articles-coverImageId" FOREIGN KEY ("coverImageId") REFERENCES "${process.env.STAGE}-documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-articles"
            ADD CONSTRAINT "fk-${process.env.STAGE}_articles-typeId" FOREIGN KEY ("typeId") REFERENCES "${process.env.STAGE}-category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-articles"
            ADD CONSTRAINT "fk-${process.env.STAGE}_articles-fileId" FOREIGN KEY ("fileId") REFERENCES "${process.env.STAGE}-documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-articles" DROP CONSTRAINT "fk-${process.env.STAGE}_articles-fileId"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-articles" DROP CONSTRAINT "fk-${process.env.STAGE}_articles-typeId"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-articles" DROP CONSTRAINT "fk-${process.env.STAGE}_articles-coverImageId"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-articles" DROP CONSTRAINT "fk-${process.env.STAGE}_articles-updatedBy"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-articles" DROP CONSTRAINT "fk-${process.env.STAGE}_articles-createdBy"
        `);
    await queryRunner.query(`
            DROP TABLE "${process.env.STAGE}-articles"
        `);
  }
}
