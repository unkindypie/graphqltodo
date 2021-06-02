import {MigrationInterface, QueryRunner} from 'typeorm';

export class Prepopulation1622671009852 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "user"("updatedAt", "createdAt", "username", "password", "isAdmin") VALUES ($1, $2, $3, $4, $5)`,
      [
        '2021-06-02T21:47:05.102Z',
        '2021-06-02T21:47:05.102Z',
        'Admin',
        '$argon2i$v=19$m=4096,t=3,p=1$NIbW/61lMFP93A482gNWeQ$LB1lRgHertcgtamWaEXoahgIyX2k5OAEMwY0gBJNVxo',
        true,
      ]
    );
    await queryRunner.query(`INSERT INTO "task_kind"("name") VALUES ($1)`, [
      'appointment',
    ]);
    await queryRunner.query(`INSERT INTO "task_kind"("name") VALUES ($1)`, [
      'event',
    ]);
    await queryRunner.query(`INSERT INTO "task_kind"("name") VALUES ($1)`, [
      'reminder',
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`delete from "user" where username = "Admin"`);
    await queryRunner.query(
      `delete from "task_kind" where username = "appointment"`
    );
    await queryRunner.query(`delete from "task_kind" where username = "event"`);
    await queryRunner.query(
      `delete from "task_kind" where username = "reminder"`
    );
  }
}
