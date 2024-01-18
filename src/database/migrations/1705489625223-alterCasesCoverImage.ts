import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterCasesCoverImage1705489625223 implements MigrationInterface {
  name = 'AlterCasesCoverImage1705489625223';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-case-studies" DROP COLUMN "judge"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-case-studies"
            ADD "judge" text array NOT NULL DEFAULT '{}'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-case-studies" DROP COLUMN "judge"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-case-studies"
            ADD "judge" character varying(64)
        `);
  }
}
