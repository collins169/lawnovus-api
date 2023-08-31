import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdministratorTable1685645832584 implements MigrationInterface {
  name = 'CreateAdministratorTable1685645832584';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."${process.env.STAGE}-administrators_type_enum" AS ENUM(
                'super-administrator',
                'administrator',
                'manager',
                'publisher'
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "${process.env.STAGE}-administrators" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "type" "public"."${process.env.STAGE}-administrators_type_enum" NOT NULL,
                "createdBy" uuid,
                "updatedBy" uuid,
                "userId" uuid NOT NULL,
                CONSTRAINT "REL_25152d3daaa560da69b76f405c" UNIQUE ("userId"),
                CONSTRAINT "pk-${process.env.STAGE}_administrators" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-administrators"
            ADD CONSTRAINT "fk-${process.env.STAGE}_administrators-createdBy" FOREIGN KEY ("createdBy") REFERENCES "${process.env.STAGE}-users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-administrators"
            ADD CONSTRAINT "fk-${process.env.STAGE}_administrators-updatedBy" FOREIGN KEY ("updatedBy") REFERENCES "${process.env.STAGE}-users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-administrators"
            ADD CONSTRAINT "fk-${process.env.STAGE}_administrators-userId" FOREIGN KEY ("userId") REFERENCES "${process.env.STAGE}-users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-administrators" DROP CONSTRAINT "fk-${process.env.STAGE}_administrators-userId"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-administrators" DROP CONSTRAINT "fk-${process.env.STAGE}_administrators-updatedBy"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-administrators" DROP CONSTRAINT "fk-${process.env.STAGE}_administrators-createdBy"
        `);
    await queryRunner.query(`
            DROP TABLE "${process.env.STAGE}-administrators"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."${process.env.STAGE}-administrators_type_enum"
        `);
  }
}
