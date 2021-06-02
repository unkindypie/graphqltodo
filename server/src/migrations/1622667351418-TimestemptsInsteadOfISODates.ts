import {MigrationInterface, QueryRunner} from 'typeorm';

export class TimestemptsInsteadOfISODates1622667351418
  implements MigrationInterface {
  name = 'TimestemptsInsteadOfISODates1622667351418';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "isAdmin" SET DEFAULT 'false'`
    );
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "task" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "task" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "dateTime"`);
    await queryRunner.query(
      `ALTER TABLE "task" ADD "dateTime" TIMESTAMP WITH TIME ZONE NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "dateTime"`);
    await queryRunner.query(`ALTER TABLE "task" ADD "dateTime" date NOT NULL`);
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "task" ADD "updatedAt" date NOT NULL`);
    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "task" ADD "createdAt" date NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "isAdmin" SET DEFAULT false`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" date NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" date NOT NULL`);
  }
}
