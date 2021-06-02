import {Migration} from '@mikro-orm/migrations';

export class Migration20210425195053 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user" ("id" serial primary key, "updated_at" timestamptz(0) not null, "created_at" timestamptz(0) not null, "username" text not null, "password" text not null);'
    );
    this.addSql(
      'alter table "user" add constraint "user_username_unique" unique ("username");'
    );

    this.addSql(
      'create table "task_kind" ("id" serial primary key, "name" text not null);'
    );

    this.addSql(
      'create table "task" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null, "description" text not null, "kind_id" int4 not null, "user_id" int4 not null);'
    );

    this.addSql(
      'alter table "task" add constraint "task_kind_id_foreign" foreign key ("kind_id") references "task_kind" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "task" add constraint "task_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;'
    );
  }
}
