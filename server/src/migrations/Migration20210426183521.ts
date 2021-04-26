import { Migration } from '@mikro-orm/migrations';

export class Migration20210426183521 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "task" add column "date_time" timestamptz(0) not null;');
  }

}
