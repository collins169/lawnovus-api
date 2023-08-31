import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDocumentTable1692232080912 implements MigrationInterface {
  name = 'AddDocumentTable1692232080912';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "${process.env.STAGE}-documents" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "name" character varying(64) NOT NULL,
                "fileType" character varying(64) NOT NULL,
                "mimeType" character varying(64) NOT NULL,
                "size" character varying(64) NOT NULL,
                "key" character varying(64) NOT NULL,
                "metaData" json NOT NULL,
                "createdBy" uuid,
                "updatedBy" uuid,
                CONSTRAINT "pk-${process.env.STAGE}_documents" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-documents"
            ADD CONSTRAINT "UQ_0bef04c302ede734fd083e07d31" UNIQUE ("key")
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-documents"
            ADD CONSTRAINT "fk-${process.env.STAGE}_documents-createdBy" FOREIGN KEY ("createdBy") REFERENCES "${process.env.STAGE}-administrators"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-documents"
            ADD CONSTRAINT "fk-${process.env.STAGE}_documents-updatedBy" FOREIGN KEY ("updatedBy") REFERENCES "${process.env.STAGE}-administrators"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-documents" DROP CONSTRAINT "fk-${process.env.STAGE}_documents-updatedBy"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-documents" DROP CONSTRAINT "fk-${process.env.STAGE}_documents-createdBy"
        `);

    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-documents" DROP CONSTRAINT "UQ_0bef04c302ede734fd083e07d31"
        `);
    await queryRunner.query(`
            DROP TABLE "${process.env.STAGE}-documents"
        `);
  }
}
