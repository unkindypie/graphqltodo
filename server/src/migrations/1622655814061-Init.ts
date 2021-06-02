import {MigrationInterface, QueryRunner} from 'typeorm';

export class Init1622655814061 implements MigrationInterface {
  name = 'Init1622655814061';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "task_kind" ("id" SERIAL NOT NULL, "name" text NOT NULL, CONSTRAINT "UQ_3bf2fb3c54c16e72a313f5d497d" UNIQUE ("name"), CONSTRAINT "PK_df2de39363e6bea9bfc22ce1d42" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "updatedAt" date NOT NULL, "createdAt" date NOT NULL, "username" text NOT NULL, "password" text NOT NULL, "isAdmin" boolean NOT NULL DEFAULT 'false', CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "task" ("id" SERIAL NOT NULL, "createdAt" date NOT NULL, "updatedAt" date NOT NULL, "title" text NOT NULL, "description" text NOT NULL, "dateTime" date NOT NULL, "completed" boolean NOT NULL DEFAULT false, "kindId" integer, "userId" integer, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_c171b41259a3ec1317f6cdd01eb" FOREIGN KEY ("kindId") REFERENCES "task_kind"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9"`
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_c171b41259a3ec1317f6cdd01eb"`
    );
    await queryRunner.query(`DROP TABLE "task"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "task_kind"`);
  }
}
