import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMoreItemToCategoryEnum1706140161359 implements MigrationInterface {
  name = 'AddMoreItemToCategoryEnum1706140161359';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-category" DROP CONSTRAINT "UQ_c239fe3bd5eecc2e94865fdadcd"
        `);
    await queryRunner.query(`
            ALTER TYPE "public"."${process.env.STAGE}-category_type_enum"
            RENAME TO "${process.env.STAGE}-category_type_enum_old"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."${process.env.STAGE}-category_type_enum" AS ENUM(
                'article',
                'book',
                'case-study',
                'legislation',
                'treaties',
                'notices'
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-category"
            ALTER COLUMN "type" TYPE "public"."${process.env.STAGE}-category_type_enum" USING "type"::"text"::"public"."${process.env.STAGE}-category_type_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."${process.env.STAGE}-category_type_enum_old"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-category"
            ADD CONSTRAINT "UQ_c239fe3bd5eecc2e94865fdadcd" UNIQUE ("type", "name")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-category" DROP CONSTRAINT "UQ_c239fe3bd5eecc2e94865fdadcd"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."${process.env.STAGE}-category_type_enum_old" AS ENUM('article', 'book', 'case-study')
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-category"
            ALTER COLUMN "type" TYPE "public"."${process.env.STAGE}-category_type_enum_old" USING "type"::"text"::"public"."${process.env.STAGE}-category_type_enum_old"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."${process.env.STAGE}-category_type_enum"
        `);
    await queryRunner.query(`
            ALTER TYPE "public"."${process.env.STAGE}-category_type_enum_old"
            RENAME TO "${process.env.STAGE}-category_type_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-category"
            ADD CONSTRAINT "UQ_c239fe3bd5eecc2e94865fdadcd" UNIQUE ("type", "name")
        `);
  }
}
