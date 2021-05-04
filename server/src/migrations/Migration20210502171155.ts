import {Migration} from '@mikro-orm/migrations';

export class Migration20210502171155 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "user" drop constraint if exists "user_is_admin_check";'
    );
    this.addSql(
      'alter table "user" alter column "is_admin" type bool using ("is_admin"::bool);'
    );
    this.addSql(
      'alter table "user" alter column "is_admin" set default \'false\';'
    );

    this.addSql(
      'alter table "task" add column "completed" bool not null default false;'
    );
  }
}
