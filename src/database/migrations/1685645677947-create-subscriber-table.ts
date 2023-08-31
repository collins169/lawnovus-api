import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSubscriberTable1685645677947 implements MigrationInterface {
  name = 'CreateSubscriberTable1685645677947';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."${process.env.STAGE}-subscribers_type_enum" AS ENUM('individual', 'institutional')
        `);
    await queryRunner.query(`
            CREATE TABLE "${process.env.STAGE}-subscribers" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "name" character varying(64) NOT NULL,
                "type" "public"."${process.env.STAGE}-subscribers_type_enum" NOT NULL,
                "phone" character varying(64) NOT NULL,
                "address" character varying(64) NOT NULL,
                "isActive" boolean NOT NULL DEFAULT false,
                "organizationTypeId" uuid,
                CONSTRAINT "UQ_48fd6c80c1de8c24ca01cbbd185" UNIQUE ("name"),
                CONSTRAINT "UQ_c64f48ae5c4f0a692f58ae25650" UNIQUE ("phone"),
                CONSTRAINT "REL_b77015c677cb4c31636e394d1a" UNIQUE ("organizationTypeId"),
                CONSTRAINT "pk-${process.env.STAGE}_subscribers" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-subscribers"
            ADD CONSTRAINT "fk-${process.env.STAGE}_subscribers-organizationTypeId" FOREIGN KEY ("organizationTypeId") REFERENCES "${process.env.STAGE}-organization-type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-subscribers" DROP CONSTRAINT "fk-${process.env.STAGE}_subscribers-organizationTypeId"
        `);
    await queryRunner.query(`
            DROP TABLE "${process.env.STAGE}-subscribers"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."${process.env.STAGE}-subscribers_type_enum"
        `);
  }
}
