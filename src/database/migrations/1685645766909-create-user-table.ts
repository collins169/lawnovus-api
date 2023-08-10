import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1685645766909 implements MigrationInterface {
  name = 'CreateUserTable1685645766909';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "${process.env.STAGE}-users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "name" character varying(64) NOT NULL,
                "username" character varying(64) NOT NULL,
                "password" character varying(64) NOT NULL,
                "profileImage" character varying(16),
                "isActive" boolean NOT NULL DEFAULT false,
                "firstTimeLogin" boolean NOT NULL DEFAULT true,
                "lastLogin" TIMESTAMP NOT NULL DEFAULT now(),
                "subscriberId" uuid NOT NULL,
                "contactDetailId" uuid NOT NULL,
                CONSTRAINT "UQ_38d9e10df62b5b6a8ccd3dc3657" UNIQUE ("username"),
                CONSTRAINT "REL_c2ad76a856e0bbe91ac209788f" UNIQUE ("contactDetailId"),
                CONSTRAINT "pk-${process.env.STAGE}_users" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-users"
            ADD CONSTRAINT "fk-${process.env.STAGE}_users-subscriberId" FOREIGN KEY ("subscriberId") REFERENCES "${process.env.STAGE}-subscribers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-users"
            ADD CONSTRAINT "fk-${process.env.STAGE}_users-contactDetailId" FOREIGN KEY ("contactDetailId") REFERENCES "${process.env.STAGE}-contact-detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-users" DROP CONSTRAINT "fk-${process.env.STAGE}_users-contactDetailId"
        `);
    await queryRunner.query(`
            ALTER TABLE "${process.env.STAGE}-users" DROP CONSTRAINT "fk-${process.env.STAGE}_users-subscriberId"
        `);
    await queryRunner.query(`
            DROP TABLE "${process.env.STAGE}-users"
        `);
  }
}
