import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTreatiesEntity1708636758165 implements MigrationInterface {
  name = 'AddTreatiesEntity1708636758165';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "${process.env.STAGE}-treaties" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "title" character varying(512) NOT NULL,
                "summary" text,
                "publicationDate" TIMESTAMP WITH TIME ZONE NOT NULL,
                "jurisdictions" text array NOT NULL DEFAULT '{}',
                "rating" integer DEFAULT '0',
                "isActive" boolean DEFAULT true,
                "keyWords" character varying(512),
                "metaData" json,
                "createdBy" uuid,
                "updatedBy" uuid,
                "typeId" uuid,
                "fileId" uuid,
                CONSTRAINT "UQ_b3f694ae5658dd170ab093a18dc" UNIQUE ("title"),
                CONSTRAINT "REL_d646b92bb38fa04e0c0fd26f57" UNIQUE ("fileId"),
                CONSTRAINT "pk-${process.env.STAGE}_treaties" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-treaties"
            ADD CONSTRAINT "fk-${process.env.STAGE}_treaties-createdBy" FOREIGN KEY ("createdBy") REFERENCES "${process.env.STAGE}-administrators"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-treaties"
            ADD CONSTRAINT "fk-${process.env.STAGE}_treaties-updatedBy" FOREIGN KEY ("updatedBy") REFERENCES "${process.env.STAGE}-administrators"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-treaties"
            ADD CONSTRAINT "fk-${process.env.STAGE}_treaties-typeId" FOREIGN KEY ("typeId") REFERENCES "${process.env.STAGE}-category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-treaties"
            ADD CONSTRAINT "fk-${process.env.STAGE}_treaties-fileId" FOREIGN KEY ("fileId") REFERENCES "${process.env.STAGE}-documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-treaties" DROP CONSTRAINT "fk-${process.env.STAGE}_treaties-fileId"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-treaties" DROP CONSTRAINT "fk-${process.env.STAGE}_treaties-typeId"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-treaties" DROP CONSTRAINT "fk-${process.env.STAGE}_treaties-updatedBy"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-treaties" DROP CONSTRAINT "fk-${process.env.STAGE}_treaties-createdBy"
        `);
    await queryRunner.query(`
            DROP TABLE "${process.env.STAGE}-treaties"
        `);
  }
}
