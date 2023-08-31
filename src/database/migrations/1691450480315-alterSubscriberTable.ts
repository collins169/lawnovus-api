import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterSubscriberTable1691450480315 implements MigrationInterface {
  name = 'AlterSubscriberTable1691450480315';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-subscribers" DROP CONSTRAINT "UQ_c64f48ae5c4f0a692f58ae25650"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-subscribers"
            ADD CONSTRAINT "UQ_c64f48ae5c4f0a692f58ae25650" UNIQUE ("phone")
        `);
  }
}
