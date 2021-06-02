import {Migration} from '@mikro-orm/migrations';

export class Migration20210429075155 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `insert into "user" ("created_at", "password", "updated_at", "username", "is_admin") values ('2021-04-29T08:38:11.163Z', '$argon2i$v=19$m=4096,t=3,p=1$g6Rc7216pJyUX66TWoajSQ$/DR9RNNYX2jsryR2wCyQFB8N2tMY28n0NMycsL/vJBc', '2021-04-29T08:38:11.163Z', 'Admin', true)`
    );
  }
}

// public async up(queryRunner: QueryRunner): Promise<void> {
//   await queryRunner.query(
//     `INSERT INTO "user"("updatedAt", "createdAt", "username", "password", "isAdmin") VALUES ("2021-06-02T21:47:05.102Z", "2021-06-02T21:47:05.102Z", "Admin","$argon2i$v=19$m=4096,t=3,p=1$NIbW/61lMFP93A482gNWeQ$LB1lRgHertcgtamWaEXoahgIyX2k5OAEMwY0gBJNVxo", true)`
//   );

//   await queryRunner.query(
//     `insert into "user" ("created_at", "password", "updated_at", "username", "is_admin") values ('2021-04-29T08:38:11.163Z', '$argon2i$v=19$m=4096,t=3,p=1$g6Rc7216pJyUX66TWoajSQ$/DR9RNNYX2jsryR2wCyQFB8N2tMY28n0NMycsL/vJBc', '2021-04-29T08:38:11.163Z', 'Admin', true)`
//   );

//   await queryRunner.query(
//     `INSERT INTO "task_kind"("name") VALUES ("Some task type")`
//   );
