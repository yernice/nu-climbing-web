import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "payload"."about_schedule" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" varchar NOT NULL,
  	"time" varchar NOT NULL,
  	"place" varchar
  );
  
  CREATE TABLE "payload"."about_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar,
  	"photo_id" integer
  );
  
  CREATE TABLE "payload"."about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'About Us' NOT NULL,
  	"image_id" integer,
  	"intro" varchar,
  	"links_instagram" varchar,
  	"links_telegram" varchar,
  	"links_email" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload"."about_schedule" ADD CONSTRAINT "about_schedule_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."about_team" ADD CONSTRAINT "about_team_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."about_team" ADD CONSTRAINT "about_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."about" ADD CONSTRAINT "about_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "about_schedule_order_idx" ON "payload"."about_schedule" USING btree ("_order");
  CREATE INDEX "about_schedule_parent_id_idx" ON "payload"."about_schedule" USING btree ("_parent_id");
  CREATE INDEX "about_team_order_idx" ON "payload"."about_team" USING btree ("_order");
  CREATE INDEX "about_team_parent_id_idx" ON "payload"."about_team" USING btree ("_parent_id");
  CREATE INDEX "about_team_photo_idx" ON "payload"."about_team" USING btree ("photo_id");
  CREATE INDEX "about_image_idx" ON "payload"."about" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."about_schedule" CASCADE;
  DROP TABLE "payload"."about_team" CASCADE;
  DROP TABLE "payload"."about" CASCADE;`)
}
