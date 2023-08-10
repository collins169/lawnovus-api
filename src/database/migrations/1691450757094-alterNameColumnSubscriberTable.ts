import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterNameColumnSubscriberTable1691450757094 implements MigrationInterface {
  name = 'AlterNameColumnSubscriberTable1691450757094';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-subscribers" DROP CONSTRAINT "UQ_48fd6c80c1de8c24ca01cbbd185"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-subscribers"
            ADD CONSTRAINT "UQ_48fd6c80c1de8c24ca01cbbd185" UNIQUE ("name")
        `);
  }
}
