import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCategoryTable1692467932130 implements MigrationInterface {
  name = 'AddCategoryTable1692467932130';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."${process.env.STAGE}-category_type_enum" AS ENUM('article', 'book', 'case-study')
        `);
    await queryRunner.query(`
            CREATE TABLE "${process.env.STAGE}-category" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "type" "public"."${process.env.STAGE}-category_type_enum" NOT NULL,
                "name" character varying(64) NOT NULL,
                "description" character varying(64),
                "createdBy" uuid,
                "updatedBy" uuid,
                CONSTRAINT "UQ_c239fe3bd5eecc2e94865fdadcd" UNIQUE ("type", "name"),
                CONSTRAINT "pk-${process.env.STAGE}_category" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-category"
            ADD CONSTRAINT "fk-${process.env.STAGE}_category-createdBy" FOREIGN KEY ("createdBy") REFERENCES "${process.env.STAGE}-administrators"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-category"
            ADD CONSTRAINT "fk-${process.env.STAGE}_category-updatedBy" FOREIGN KEY ("updatedBy") REFERENCES "${process.env.STAGE}-administrators"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-category" DROP CONSTRAINT "fk-${process.env.STAGE}_category-updatedBy"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-category" DROP CONSTRAINT "fk-${process.env.STAGE}_category-createdBy"
        `);
    await queryRunner.query(`
            DROP TABLE "${process.env.STAGE}-category"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."${process.env.STAGE}-category_type_enum"
        `);
  }
}
