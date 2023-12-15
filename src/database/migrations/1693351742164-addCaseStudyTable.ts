import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCaseStudyTable1693351742164 implements MigrationInterface {
  name = 'AddCaseStudyTable1693351742164';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "${process.env.STAGE}-case-studies" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "title" character varying(64) NOT NULL,
                "summary" text NOT NULL,
                "judge" character varying(64),
                "lawyers" text array NOT NULL DEFAULT '{}',
                "court" character varying(64),
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
                CONSTRAINT "UQ_2b657b7ebed6ccd8589a801cdcd" UNIQUE ("title"),
                CONSTRAINT "REL_f342a960a2bcdbd86ef9449ea3" UNIQUE ("coverImageId"),
                CONSTRAINT "REL_ccc82f3d35b318293db5aac530" UNIQUE ("fileId"),
                CONSTRAINT "pk-${process.env.STAGE}_case_studies" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-case-studies"
            ADD CONSTRAINT "fk-${process.env.STAGE}_case_studies-createdBy" FOREIGN KEY ("createdBy") REFERENCES "${process.env.STAGE}-administrators"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-case-studies"
            ADD CONSTRAINT "fk-${process.env.STAGE}_case_studies-updatedBy" FOREIGN KEY ("updatedBy") REFERENCES "${process.env.STAGE}-administrators"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-case-studies"
            ADD CONSTRAINT "fk-${process.env.STAGE}_case_studies-coverImageId" FOREIGN KEY ("coverImageId") REFERENCES "${process.env.STAGE}-documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-case-studies"
            ADD CONSTRAINT "fk-${process.env.STAGE}_case_studies-typeId" FOREIGN KEY ("typeId") REFERENCES "${process.env.STAGE}-category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-case-studies"
            ADD CONSTRAINT "fk-${process.env.STAGE}_case_studies-fileId" FOREIGN KEY ("fileId") REFERENCES "${process.env.STAGE}-documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-case-studies" DROP CONSTRAINT "fk-${process.env.STAGE}_case_studies-fileId"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-case-studies" DROP CONSTRAINT "fk-${process.env.STAGE}_case_studies-typeId"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-case-studies" DROP CONSTRAINT "fk-${process.env.STAGE}_case_studies-coverImageId"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-case-studies" DROP CONSTRAINT "fk-${process.env.STAGE}_case_studies-updatedBy"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-case-studies" DROP CONSTRAINT "fk-${process.env.STAGE}_case_studies-createdBy"
        `);
    await queryRunner.query(`
            DROP TABLE "${process.env.STAGE}-case-studies"
        `);
  }
}
