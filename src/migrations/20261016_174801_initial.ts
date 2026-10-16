import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_paths_level" AS ENUM('beginner', 'intermediate', 'advanced');
  CREATE TYPE "payload"."enum_paths_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__paths_v_version_level" AS ENUM('beginner', 'intermediate', 'advanced');
  CREATE TYPE "payload"."enum__paths_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_courses_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__courses_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "payload"."paths" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"summary" varchar,
  	"level" "payload"."enum_paths_level" DEFAULT 'beginner',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_paths_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."paths_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"courses_id" integer
  );
  
  CREATE TABLE "payload"."_paths_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_level" "payload"."enum__paths_v_version_level" DEFAULT 'beginner',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__paths_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."_paths_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"courses_id" integer
  );
  
  CREATE TABLE "payload"."courses_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"body" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."courses_chapters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "payload"."courses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"summary" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_courses_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."_courses_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"body" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_courses_v_version_chapters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_courses_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_summary" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__courses_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"author_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."articles_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_author_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."_articles_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "payload"."users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"paths_id" integer,
  	"courses_id" integer,
  	"articles_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload"."paths_rels" ADD CONSTRAINT "paths_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."paths"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."paths_rels" ADD CONSTRAINT "paths_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "payload"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_paths_v" ADD CONSTRAINT "_paths_v_parent_id_paths_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."paths"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_paths_v_rels" ADD CONSTRAINT "_paths_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."_paths_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_paths_v_rels" ADD CONSTRAINT "_paths_v_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "payload"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."courses_blocks_rich_text" ADD CONSTRAINT "courses_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."courses_chapters" ADD CONSTRAINT "courses_chapters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_courses_v_blocks_rich_text" ADD CONSTRAINT "_courses_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_courses_v_version_chapters" ADD CONSTRAINT "_courses_v_version_chapters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_courses_v" ADD CONSTRAINT "_courses_v_parent_id_courses_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."articles" ADD CONSTRAINT "articles_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."articles_texts" ADD CONSTRAINT "articles_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_articles_v" ADD CONSTRAINT "_articles_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "payload"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_articles_v_texts" ADD CONSTRAINT "_articles_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_paths_fk" FOREIGN KEY ("paths_id") REFERENCES "payload"."paths"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "payload"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "payload"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "paths_slug_idx" ON "payload"."paths" USING btree ("slug");
  CREATE INDEX "paths_updated_at_idx" ON "payload"."paths" USING btree ("updated_at");
  CREATE INDEX "paths_created_at_idx" ON "payload"."paths" USING btree ("created_at");
  CREATE INDEX "paths__status_idx" ON "payload"."paths" USING btree ("_status");
  CREATE INDEX "paths_rels_order_idx" ON "payload"."paths_rels" USING btree ("order");
  CREATE INDEX "paths_rels_parent_idx" ON "payload"."paths_rels" USING btree ("parent_id");
  CREATE INDEX "paths_rels_path_idx" ON "payload"."paths_rels" USING btree ("path");
  CREATE INDEX "paths_rels_courses_id_idx" ON "payload"."paths_rels" USING btree ("courses_id");
  CREATE INDEX "_paths_v_parent_idx" ON "payload"."_paths_v" USING btree ("parent_id");
  CREATE INDEX "_paths_v_version_version_slug_idx" ON "payload"."_paths_v" USING btree ("version_slug");
  CREATE INDEX "_paths_v_version_version_updated_at_idx" ON "payload"."_paths_v" USING btree ("version_updated_at");
  CREATE INDEX "_paths_v_version_version_created_at_idx" ON "payload"."_paths_v" USING btree ("version_created_at");
  CREATE INDEX "_paths_v_version_version__status_idx" ON "payload"."_paths_v" USING btree ("version__status");
  CREATE INDEX "_paths_v_created_at_idx" ON "payload"."_paths_v" USING btree ("created_at");
  CREATE INDEX "_paths_v_updated_at_idx" ON "payload"."_paths_v" USING btree ("updated_at");
  CREATE INDEX "_paths_v_latest_idx" ON "payload"."_paths_v" USING btree ("latest");
  CREATE INDEX "_paths_v_rels_order_idx" ON "payload"."_paths_v_rels" USING btree ("order");
  CREATE INDEX "_paths_v_rels_parent_idx" ON "payload"."_paths_v_rels" USING btree ("parent_id");
  CREATE INDEX "_paths_v_rels_path_idx" ON "payload"."_paths_v_rels" USING btree ("path");
  CREATE INDEX "_paths_v_rels_courses_id_idx" ON "payload"."_paths_v_rels" USING btree ("courses_id");
  CREATE INDEX "courses_blocks_rich_text_order_idx" ON "payload"."courses_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "courses_blocks_rich_text_parent_id_idx" ON "payload"."courses_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "courses_blocks_rich_text_path_idx" ON "payload"."courses_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "courses_chapters_order_idx" ON "payload"."courses_chapters" USING btree ("_order");
  CREATE INDEX "courses_chapters_parent_id_idx" ON "payload"."courses_chapters" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "courses_slug_idx" ON "payload"."courses" USING btree ("slug");
  CREATE INDEX "courses_updated_at_idx" ON "payload"."courses" USING btree ("updated_at");
  CREATE INDEX "courses_created_at_idx" ON "payload"."courses" USING btree ("created_at");
  CREATE INDEX "courses__status_idx" ON "payload"."courses" USING btree ("_status");
  CREATE INDEX "_courses_v_blocks_rich_text_order_idx" ON "payload"."_courses_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_courses_v_blocks_rich_text_parent_id_idx" ON "payload"."_courses_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_courses_v_blocks_rich_text_path_idx" ON "payload"."_courses_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_courses_v_version_chapters_order_idx" ON "payload"."_courses_v_version_chapters" USING btree ("_order");
  CREATE INDEX "_courses_v_version_chapters_parent_id_idx" ON "payload"."_courses_v_version_chapters" USING btree ("_parent_id");
  CREATE INDEX "_courses_v_parent_idx" ON "payload"."_courses_v" USING btree ("parent_id");
  CREATE INDEX "_courses_v_version_version_slug_idx" ON "payload"."_courses_v" USING btree ("version_slug");
  CREATE INDEX "_courses_v_version_version_updated_at_idx" ON "payload"."_courses_v" USING btree ("version_updated_at");
  CREATE INDEX "_courses_v_version_version_created_at_idx" ON "payload"."_courses_v" USING btree ("version_created_at");
  CREATE INDEX "_courses_v_version_version__status_idx" ON "payload"."_courses_v" USING btree ("version__status");
  CREATE INDEX "_courses_v_created_at_idx" ON "payload"."_courses_v" USING btree ("created_at");
  CREATE INDEX "_courses_v_updated_at_idx" ON "payload"."_courses_v" USING btree ("updated_at");
  CREATE INDEX "_courses_v_latest_idx" ON "payload"."_courses_v" USING btree ("latest");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "payload"."articles" USING btree ("slug");
  CREATE INDEX "articles_author_idx" ON "payload"."articles" USING btree ("author_id");
  CREATE INDEX "articles_updated_at_idx" ON "payload"."articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "payload"."articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "payload"."articles" USING btree ("_status");
  CREATE INDEX "articles_texts_order_parent" ON "payload"."articles_texts" USING btree ("order","parent_id");
  CREATE INDEX "_articles_v_parent_idx" ON "payload"."_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "payload"."_articles_v" USING btree ("version_slug");
  CREATE INDEX "_articles_v_version_version_author_idx" ON "payload"."_articles_v" USING btree ("version_author_id");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "payload"."_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "payload"."_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "payload"."_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "payload"."_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "payload"."_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_latest_idx" ON "payload"."_articles_v" USING btree ("latest");
  CREATE INDEX "_articles_v_texts_order_parent" ON "payload"."_articles_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "payload"."users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "payload"."users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "payload"."users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "payload"."users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "payload"."users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_paths_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("paths_id");
  CREATE INDEX "payload_locked_documents_rels_courses_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("courses_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload"."payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."paths" CASCADE;
  DROP TABLE "payload"."paths_rels" CASCADE;
  DROP TABLE "payload"."_paths_v" CASCADE;
  DROP TABLE "payload"."_paths_v_rels" CASCADE;
  DROP TABLE "payload"."courses_blocks_rich_text" CASCADE;
  DROP TABLE "payload"."courses_chapters" CASCADE;
  DROP TABLE "payload"."courses" CASCADE;
  DROP TABLE "payload"."_courses_v_blocks_rich_text" CASCADE;
  DROP TABLE "payload"."_courses_v_version_chapters" CASCADE;
  DROP TABLE "payload"."_courses_v" CASCADE;
  DROP TABLE "payload"."articles" CASCADE;
  DROP TABLE "payload"."articles_texts" CASCADE;
  DROP TABLE "payload"."_articles_v" CASCADE;
  DROP TABLE "payload"."_articles_v_texts" CASCADE;
  DROP TABLE "payload"."users_sessions" CASCADE;
  DROP TABLE "payload"."users" CASCADE;
  DROP TABLE "payload"."payload_kv" CASCADE;
  DROP TABLE "payload"."payload_locked_documents" CASCADE;
  DROP TABLE "payload"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload"."payload_preferences" CASCADE;
  DROP TABLE "payload"."payload_preferences_rels" CASCADE;
  DROP TABLE "payload"."payload_migrations" CASCADE;
  DROP TYPE "payload"."enum_paths_level";
  DROP TYPE "payload"."enum_paths_status";
  DROP TYPE "payload"."enum__paths_v_version_level";
  DROP TYPE "payload"."enum__paths_v_version_status";
  DROP TYPE "payload"."enum_courses_status";
  DROP TYPE "payload"."enum__courses_v_version_status";
  DROP TYPE "payload"."enum_articles_status";
  DROP TYPE "payload"."enum__articles_v_version_status";`)
}
