import {Migration} from '@mikro-orm/migrations';

export class Migration20210429075155 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "user" add column "is_admin" bool not null default \'false\';'
    );
  }
}
