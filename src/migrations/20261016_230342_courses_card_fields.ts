import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_courses_level" AS ENUM('Débutant', 'Intermédiaire', 'Avancé');
  CREATE TYPE "payload"."enum_courses_icon" AS ENUM('binary', 'cpu', 'globe', 'layers', 'lock', 'network', 'newspaper', 'route', 'server', 'shield', 'docker', 'javascript', 'python', 'react', 'rust', 'typescript');
  CREATE TYPE "payload"."enum__courses_v_version_level" AS ENUM('Débutant', 'Intermédiaire', 'Avancé');
  CREATE TYPE "payload"."enum__courses_v_version_icon" AS ENUM('binary', 'cpu', 'globe', 'layers', 'lock', 'network', 'newspaper', 'route', 'server', 'shield', 'docker', 'javascript', 'python', 'react', 'rust', 'typescript');
  CREATE TABLE "payload"."courses_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."_courses_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "payload"."courses" ADD COLUMN "level" "payload"."enum_courses_level";
  ALTER TABLE "payload"."courses" ADD COLUMN "icon" "payload"."enum_courses_icon" DEFAULT 'binary';
  ALTER TABLE "payload"."_courses_v" ADD COLUMN "version_level" "payload"."enum__courses_v_version_level";
  ALTER TABLE "payload"."_courses_v" ADD COLUMN "version_icon" "payload"."enum__courses_v_version_icon" DEFAULT 'binary';
  ALTER TABLE "payload"."courses_texts" ADD CONSTRAINT "courses_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_courses_v_texts" ADD CONSTRAINT "_courses_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "courses_texts_order_parent" ON "payload"."courses_texts" USING btree ("order","parent_id");
  CREATE INDEX "_courses_v_texts_order_parent" ON "payload"."_courses_v_texts" USING btree ("order","parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."courses_texts" CASCADE;
  DROP TABLE "payload"."_courses_v_texts" CASCADE;
  ALTER TABLE "payload"."courses" DROP COLUMN "level";
  ALTER TABLE "payload"."courses" DROP COLUMN "icon";
  ALTER TABLE "payload"."_courses_v" DROP COLUMN "version_level";
  ALTER TABLE "payload"."_courses_v" DROP COLUMN "version_icon";
  DROP TYPE "payload"."enum_courses_level";
  DROP TYPE "payload"."enum_courses_icon";
  DROP TYPE "payload"."enum__courses_v_version_level";
  DROP TYPE "payload"."enum__courses_v_version_icon";`)
}
