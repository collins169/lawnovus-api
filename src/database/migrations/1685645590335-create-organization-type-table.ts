import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrganizationTypeTable1685645590335 implements MigrationInterface {
  name = 'CreateOrganizationTypeTable1685645590335';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "${process.env.STAGE}-organization-type" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "name" character varying(64) NOT NULL,
                "description" character varying(512) NOT NULL,
                "isActive" boolean NOT NULL DEFAULT true,
                CONSTRAINT "UQ_3a9843d5716bc43e1df764d2122" UNIQUE ("name", "deletedAt"),
                CONSTRAINT "pk-${process.env.STAGE}_organization_type" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "${process.env.STAGE}-organization-type"
        `);
  }
}
