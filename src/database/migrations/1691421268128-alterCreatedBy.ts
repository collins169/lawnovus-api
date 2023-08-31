import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterCreatedBy1691421268128 implements MigrationInterface {
  name = 'AlterCreatedBy1691421268128';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-administrators" DROP CONSTRAINT "fk-${process.env.STAGE}_administrators-createdBy"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-administrators" DROP CONSTRAINT "fk-${process.env.STAGE}_administrators-updatedBy"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-administrators" DROP COLUMN "createdBy"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-administrators" DROP COLUMN "updatedBy"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-subscribers"
            ADD "createdBy" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-subscribers"
            ADD "updatedBy" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-users" DROP CONSTRAINT "fk-${process.env.STAGE}_users-subscriberId"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-users"
            ALTER COLUMN "subscriberId" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-subscribers"
            ADD CONSTRAINT "fk-${process.env.STAGE}_subscribers-createdBy" FOREIGN KEY ("createdBy") REFERENCES "${process.env.STAGE}-administrators"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-subscribers"
            ADD CONSTRAINT "fk-${process.env.STAGE}_subscribers-updatedBy" FOREIGN KEY ("updatedBy") REFERENCES "${process.env.STAGE}-administrators"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-users"
            ADD CONSTRAINT "fk-${process.env.STAGE}_users-subscriberId" FOREIGN KEY ("subscriberId") REFERENCES "${process.env.STAGE}-subscribers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-users" DROP CONSTRAINT "fk-${process.env.STAGE}_users-subscriberId"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-subscribers" DROP CONSTRAINT "fk-${process.env.STAGE}_subscribers-updatedBy"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-subscribers" DROP CONSTRAINT "fk-${process.env.STAGE}_subscribers-createdBy"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-users"
            ALTER COLUMN "subscriberId"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-users"
            ADD CONSTRAINT "fk-${process.env.STAGE}_users-subscriberId" FOREIGN KEY ("subscriberId") REFERENCES "${process.env.STAGE}-subscribers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-subscribers" DROP COLUMN "updatedBy"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-subscribers" DROP COLUMN "createdBy"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-administrators"
            ADD "updatedBy" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-administrators"
            ADD "createdBy" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-administrators"
            ADD CONSTRAINT "fk-${process.env.STAGE}_administrators-updatedBy" FOREIGN KEY ("updatedBy") REFERENCES "${process.env.STAGE}-users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-administrators"
            ADD CONSTRAINT "fk-${process.env.STAGE}_administrators-createdBy" FOREIGN KEY ("createdBy") REFERENCES "${process.env.STAGE}-users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
