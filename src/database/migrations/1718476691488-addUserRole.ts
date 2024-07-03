import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRole1718476691488 implements MigrationInterface {
  name = 'AddUserRole1718476691488';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."${process.env.STAGE}-users_role_enum" AS ENUM('admin', 'subscriber')
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-users"
            ADD "role" "public"."${process.env.STAGE}-users_role_enum" NOT NULL DEFAULT 'subscriber'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-users" DROP COLUMN "role"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."${process.env.STAGE}-users_role_enum"
        `);
  }
}
