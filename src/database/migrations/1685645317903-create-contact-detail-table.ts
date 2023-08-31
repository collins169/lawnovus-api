import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateContactDetailTable1685645317903 implements MigrationInterface {
  name = 'CreateContactDetailTable1685645317903';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "${process.env.STAGE}-contact-detail" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "isContactPerson" boolean NOT NULL DEFAULT false,
                "name" character varying(64) NOT NULL,
                "email" character varying(64) NOT NULL,
                "phone" character varying(64) NOT NULL,
                "address" character varying(64) NOT NULL,
                CONSTRAINT "UQ_8d51a4d7639552819fae9eafeb6" UNIQUE ("email"),
                CONSTRAINT "UQ_1c44425739b4c90c3b51cf55f74" UNIQUE ("phone"),
                CONSTRAINT "pk-${process.env.STAGE}_contact_detail" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "${process.env.STAGE}-contact-detail"
        `);
  }
}
