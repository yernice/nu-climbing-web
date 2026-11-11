import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "payload"."about_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."about_activities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  ALTER TABLE "payload"."about" ADD COLUMN "motto" varchar;
  ALTER TABLE "payload"."about_facts" ADD CONSTRAINT "about_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."about_activities" ADD CONSTRAINT "about_activities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."about"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "about_facts_order_idx" ON "payload"."about_facts" USING btree ("_order");
  CREATE INDEX "about_facts_parent_id_idx" ON "payload"."about_facts" USING btree ("_parent_id");
  CREATE INDEX "about_activities_order_idx" ON "payload"."about_activities" USING btree ("_order");
  CREATE INDEX "about_activities_parent_id_idx" ON "payload"."about_activities" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."about_facts" CASCADE;
  DROP TABLE "payload"."about_activities" CASCADE;
  ALTER TABLE "payload"."about" DROP COLUMN "motto";`)
}
