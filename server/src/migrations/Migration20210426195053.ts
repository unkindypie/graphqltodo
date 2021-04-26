import {Migration} from '@mikro-orm/migrations';

export class Migration20210426195053 extends Migration {
  async up(): Promise<void> {
    this.addSql(`insert into "task_kind" ("name") values ('appointment');`);
    this.addSql(`insert into "task_kind" ("name") values ('event');`);
    this.addSql(`insert into "task_kind" ("name") values ('reminder');`);
  }
}
