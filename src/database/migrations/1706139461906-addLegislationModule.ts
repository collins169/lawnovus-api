import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLegislationModule1706139461906 implements MigrationInterface {
  name = 'AddLegislationModule1706139461906';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "${process.env.STAGE}-legislation" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "title" character varying(64) NOT NULL,
                "summary" text NOT NULL,
                "jurisdiction" character varying(64),
                "publicationDate" TIMESTAMP WITH TIME ZONE NOT NULL,
                "status" boolean DEFAULT true,
                "metaData" json,
                "createdBy" uuid,
                "updatedBy" uuid,
                "coverImageId" uuid,
                "typeId" uuid,
                "fileId" uuid,
                CONSTRAINT "UQ_09cdcc64f51d62d36baed38cb91" UNIQUE ("title"),
                CONSTRAINT "REL_03268bf973e051f96037b74c98" UNIQUE ("coverImageId"),
                CONSTRAINT "REL_802776922becdd4f875031a7ea" UNIQUE ("fileId"),
                CONSTRAINT "pk-${process.env.STAGE}_legislation" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-legislation"
            ADD CONSTRAINT "fk-${process.env.STAGE}_legislation-createdBy" FOREIGN KEY ("createdBy") REFERENCES "${process.env.STAGE}-administrators"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-legislation"
            ADD CONSTRAINT "fk-${process.env.STAGE}_legislation-updatedBy" FOREIGN KEY ("updatedBy") REFERENCES "${process.env.STAGE}-administrators"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-legislation"
            ADD CONSTRAINT "fk-${process.env.STAGE}_legislation-coverImageId" FOREIGN KEY ("coverImageId") REFERENCES "${process.env.STAGE}-documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-legislation"
            ADD CONSTRAINT "fk-${process.env.STAGE}_legislation-typeId" FOREIGN KEY ("typeId") REFERENCES "${process.env.STAGE}-category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-legislation"
            ADD CONSTRAINT "fk-${process.env.STAGE}_legislation-fileId" FOREIGN KEY ("fileId") REFERENCES "${process.env.STAGE}-documents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-legislation" DROP CONSTRAINT "fk-${process.env.STAGE}_legislation-fileId"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-legislation" DROP CONSTRAINT "fk-${process.env.STAGE}_legislation-typeId"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-legislation" DROP CONSTRAINT "fk-${process.env.STAGE}_legislation-coverImageId"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-legislation" DROP CONSTRAINT "fk-${process.env.STAGE}_legislation-updatedBy"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-legislation" DROP CONSTRAINT "fk-${process.env.STAGE}_legislation-createdBy"
        `);
    await queryRunner.query(`
            DROP TABLE "${process.env.STAGE}-legislation"
        `);
  }
}
