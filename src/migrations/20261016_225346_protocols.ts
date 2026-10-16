import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_protocols_steps_from" AS ENUM('a', 'b');
  CREATE TYPE "payload"."enum_protocols_steps_to" AS ENUM('a', 'b');
  CREATE TYPE "payload"."enum_protocols_steps_tone" AS ENUM('primary', 'secondary', 'info', 'success');
  CREATE TYPE "payload"."enum_protocols_level" AS ENUM('Débutant', 'Intermédiaire', 'Avancé');
  CREATE TYPE "payload"."enum_protocols_icon" AS ENUM('binary', 'cpu', 'globe', 'layers', 'lock', 'network', 'newspaper', 'route', 'server', 'shield', 'docker', 'javascript', 'python', 'react', 'rust', 'typescript');
  CREATE TYPE "payload"."enum_protocols_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__protocols_v_version_steps_from" AS ENUM('a', 'b');
  CREATE TYPE "payload"."enum__protocols_v_version_steps_to" AS ENUM('a', 'b');
  CREATE TYPE "payload"."enum__protocols_v_version_steps_tone" AS ENUM('primary', 'secondary', 'info', 'success');
  CREATE TYPE "payload"."enum__protocols_v_version_level" AS ENUM('Débutant', 'Intermédiaire', 'Avancé');
  CREATE TYPE "payload"."enum__protocols_v_version_icon" AS ENUM('binary', 'cpu', 'globe', 'layers', 'lock', 'network', 'newspaper', 'route', 'server', 'shield', 'docker', 'javascript', 'python', 'react', 'rust', 'typescript');
  CREATE TYPE "payload"."enum__protocols_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "payload"."courses_blocks_protocol_diagram" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"diagram_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_courses_v_blocks_protocol_diagram" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"diagram_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."protocols_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"from" "payload"."enum_protocols_steps_from" DEFAULT 'a',
  	"to" "payload"."enum_protocols_steps_to" DEFAULT 'b',
  	"label" varchar,
  	"detail" varchar,
  	"note" varchar,
  	"tone" "payload"."enum_protocols_steps_tone" DEFAULT 'secondary',
  	"state_a" varchar,
  	"state_b" varchar,
  	"can_be_lost" boolean,
  	"loss_lost_note" varchar,
  	"loss_wait_note" varchar,
  	"loss_retransmit_note" varchar
  );
  
  CREATE TABLE "payload"."protocols" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"summary" varchar,
  	"level" "payload"."enum_protocols_level",
  	"icon" "payload"."enum_protocols_icon" DEFAULT 'network',
  	"author_id" integer,
  	"machine_a_label" varchar DEFAULT 'Client',
  	"machine_a_sublabel" varchar DEFAULT 'your browser',
  	"machine_a_initial_state" varchar DEFAULT 'CLOSED',
  	"machine_b_label" varchar DEFAULT 'Server',
  	"machine_b_sublabel" varchar DEFAULT 'the website',
  	"machine_b_initial_state" varchar DEFAULT 'LISTEN',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_protocols_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."protocols_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."_protocols_v_version_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" "payload"."enum__protocols_v_version_steps_from" DEFAULT 'a',
  	"to" "payload"."enum__protocols_v_version_steps_to" DEFAULT 'b',
  	"label" varchar,
  	"detail" varchar,
  	"note" varchar,
  	"tone" "payload"."enum__protocols_v_version_steps_tone" DEFAULT 'secondary',
  	"state_a" varchar,
  	"state_b" varchar,
  	"can_be_lost" boolean,
  	"loss_lost_note" varchar,
  	"loss_wait_note" varchar,
  	"loss_retransmit_note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_protocols_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_level" "payload"."enum__protocols_v_version_level",
  	"version_icon" "payload"."enum__protocols_v_version_icon" DEFAULT 'network',
  	"version_author_id" integer,
  	"version_machine_a_label" varchar DEFAULT 'Client',
  	"version_machine_a_sublabel" varchar DEFAULT 'your browser',
  	"version_machine_a_initial_state" varchar DEFAULT 'CLOSED',
  	"version_machine_b_label" varchar DEFAULT 'Server',
  	"version_machine_b_sublabel" varchar DEFAULT 'the website',
  	"version_machine_b_initial_state" varchar DEFAULT 'LISTEN',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__protocols_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."_protocols_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "protocols_id" integer;
  ALTER TABLE "payload"."courses_blocks_protocol_diagram" ADD CONSTRAINT "courses_blocks_protocol_diagram_diagram_id_protocols_id_fk" FOREIGN KEY ("diagram_id") REFERENCES "payload"."protocols"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."courses_blocks_protocol_diagram" ADD CONSTRAINT "courses_blocks_protocol_diagram_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_courses_v_blocks_protocol_diagram" ADD CONSTRAINT "_courses_v_blocks_protocol_diagram_diagram_id_protocols_id_fk" FOREIGN KEY ("diagram_id") REFERENCES "payload"."protocols"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_courses_v_blocks_protocol_diagram" ADD CONSTRAINT "_courses_v_blocks_protocol_diagram_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."protocols_steps" ADD CONSTRAINT "protocols_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."protocols"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."protocols" ADD CONSTRAINT "protocols_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."protocols_texts" ADD CONSTRAINT "protocols_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."protocols"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_protocols_v_version_steps" ADD CONSTRAINT "_protocols_v_version_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_protocols_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_protocols_v" ADD CONSTRAINT "_protocols_v_parent_id_protocols_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."protocols"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_protocols_v" ADD CONSTRAINT "_protocols_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_protocols_v_texts" ADD CONSTRAINT "_protocols_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."_protocols_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "courses_blocks_protocol_diagram_order_idx" ON "payload"."courses_blocks_protocol_diagram" USING btree ("_order");
  CREATE INDEX "courses_blocks_protocol_diagram_parent_id_idx" ON "payload"."courses_blocks_protocol_diagram" USING btree ("_parent_id");
  CREATE INDEX "courses_blocks_protocol_diagram_path_idx" ON "payload"."courses_blocks_protocol_diagram" USING btree ("_path");
  CREATE INDEX "courses_blocks_protocol_diagram_diagram_idx" ON "payload"."courses_blocks_protocol_diagram" USING btree ("diagram_id");
  CREATE INDEX "_courses_v_blocks_protocol_diagram_order_idx" ON "payload"."_courses_v_blocks_protocol_diagram" USING btree ("_order");
  CREATE INDEX "_courses_v_blocks_protocol_diagram_parent_id_idx" ON "payload"."_courses_v_blocks_protocol_diagram" USING btree ("_parent_id");
  CREATE INDEX "_courses_v_blocks_protocol_diagram_path_idx" ON "payload"."_courses_v_blocks_protocol_diagram" USING btree ("_path");
  CREATE INDEX "_courses_v_blocks_protocol_diagram_diagram_idx" ON "payload"."_courses_v_blocks_protocol_diagram" USING btree ("diagram_id");
  CREATE INDEX "protocols_steps_order_idx" ON "payload"."protocols_steps" USING btree ("_order");
  CREATE INDEX "protocols_steps_parent_id_idx" ON "payload"."protocols_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "protocols_slug_idx" ON "payload"."protocols" USING btree ("slug");
  CREATE INDEX "protocols_author_idx" ON "payload"."protocols" USING btree ("author_id");
  CREATE INDEX "protocols_updated_at_idx" ON "payload"."protocols" USING btree ("updated_at");
  CREATE INDEX "protocols_created_at_idx" ON "payload"."protocols" USING btree ("created_at");
  CREATE INDEX "protocols__status_idx" ON "payload"."protocols" USING btree ("_status");
  CREATE INDEX "protocols_texts_order_parent" ON "payload"."protocols_texts" USING btree ("order","parent_id");
  CREATE INDEX "_protocols_v_version_steps_order_idx" ON "payload"."_protocols_v_version_steps" USING btree ("_order");
  CREATE INDEX "_protocols_v_version_steps_parent_id_idx" ON "payload"."_protocols_v_version_steps" USING btree ("_parent_id");
  CREATE INDEX "_protocols_v_parent_idx" ON "payload"."_protocols_v" USING btree ("parent_id");
  CREATE INDEX "_protocols_v_version_version_slug_idx" ON "payload"."_protocols_v" USING btree ("version_slug");
  CREATE INDEX "_protocols_v_version_version_author_idx" ON "payload"."_protocols_v" USING btree ("version_author_id");
  CREATE INDEX "_protocols_v_version_version_updated_at_idx" ON "payload"."_protocols_v" USING btree ("version_updated_at");
  CREATE INDEX "_protocols_v_version_version_created_at_idx" ON "payload"."_protocols_v" USING btree ("version_created_at");
  CREATE INDEX "_protocols_v_version_version__status_idx" ON "payload"."_protocols_v" USING btree ("version__status");
  CREATE INDEX "_protocols_v_created_at_idx" ON "payload"."_protocols_v" USING btree ("created_at");
  CREATE INDEX "_protocols_v_updated_at_idx" ON "payload"."_protocols_v" USING btree ("updated_at");
  CREATE INDEX "_protocols_v_latest_idx" ON "payload"."_protocols_v" USING btree ("latest");
  CREATE INDEX "_protocols_v_texts_order_parent" ON "payload"."_protocols_v_texts" USING btree ("order","parent_id");
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_protocols_fk" FOREIGN KEY ("protocols_id") REFERENCES "payload"."protocols"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_protocols_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("protocols_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."courses_blocks_protocol_diagram" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_courses_v_blocks_protocol_diagram" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."protocols_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."protocols" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."protocols_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_protocols_v_version_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_protocols_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_protocols_v_texts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload"."courses_blocks_protocol_diagram" CASCADE;
  DROP TABLE "payload"."_courses_v_blocks_protocol_diagram" CASCADE;
  DROP TABLE "payload"."protocols_steps" CASCADE;
  DROP TABLE "payload"."protocols" CASCADE;
  DROP TABLE "payload"."protocols_texts" CASCADE;
  DROP TABLE "payload"."_protocols_v_version_steps" CASCADE;
  DROP TABLE "payload"."_protocols_v" CASCADE;
  DROP TABLE "payload"."_protocols_v_texts" CASCADE;
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_protocols_fk";
  
  DROP INDEX "payload"."payload_locked_documents_rels_protocols_id_idx";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "protocols_id";
  DROP TYPE "payload"."enum_protocols_steps_from";
  DROP TYPE "payload"."enum_protocols_steps_to";
  DROP TYPE "payload"."enum_protocols_steps_tone";
  DROP TYPE "payload"."enum_protocols_level";
  DROP TYPE "payload"."enum_protocols_icon";
  DROP TYPE "payload"."enum_protocols_status";
  DROP TYPE "payload"."enum__protocols_v_version_steps_from";
  DROP TYPE "payload"."enum__protocols_v_version_steps_to";
  DROP TYPE "payload"."enum__protocols_v_version_steps_tone";
  DROP TYPE "payload"."enum__protocols_v_version_level";
  DROP TYPE "payload"."enum__protocols_v_version_icon";
  DROP TYPE "payload"."enum__protocols_v_version_status";`)
}
