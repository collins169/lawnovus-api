import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNoticesEntity1708636656430 implements MigrationInterface {
  name = 'AddNoticesEntity1708636656430';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "${process.env.STAGE}-notices" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "title" character varying(512) NOT NULL,
                "summary" text,
                "publicationDate" TIMESTAMP WITH TIME ZONE NOT NULL,
                "jurisdiction" character varying(512),
                "rating" integer DEFAULT '0',
                "isActive" boolean DEFAULT true,
                "keyWords" character varying(512),
                "metaData" json,
                "createdBy" uuid,
                "updatedBy" uuid,
                "typeId" uuid,
                "fileId" uuid,
                CONSTRAINT "UQ_ef19c5b12284c55147f398a9fe8" UNIQUE ("title"),
                CONSTRAINT "REL_43a22c6a35719abda09d7626a0" UNIQUE ("fileId"),
                CONSTRAINT "pk-${process.env.STAGE}_notices" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-notices"
            ADD CONSTRAINT "fk-${process.env.STAGE}_notices-createdBy" FOREIGN KEY ("createdBy") REFERENCES "${process.env.STAGE}-administrators"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-notices"
            ADD CONSTRAINT "fk-${process.env.STAGE}_notices-updatedBy" FOREIGN KEY ("updatedBy") REFERENCES "${process.env.STAGE}-administrators"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-notices"
            ADD CONSTRAINT "fk-${process.env.STAGE}_notices-typeId" FOREIGN KEY ("typeId") REFERENCES "${process.env.STAGE}-category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-notices"
            ADD CONSTRAINT "fk-${process.env.STAGE}_notices-fileId" FOREIGN KEY ("fileId") REFERENCES "${process.env.STAGE}-documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-notices" DROP CONSTRAINT "fk-${process.env.STAGE}_notices-fileId"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-notices" DROP CONSTRAINT "fk-${process.env.STAGE}_notices-typeId"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-notices" DROP CONSTRAINT "fk-${process.env.STAGE}_notices-updatedBy"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-notices" DROP CONSTRAINT "fk-${process.env.STAGE}_notices-createdBy"
        `);
    await queryRunner.query(`
            DROP TABLE "${process.env.STAGE}-notices"
        `);
  }
}
