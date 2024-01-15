CREATE TABLE IF NOT EXISTS "files" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"opened_at" timestamp,
	"file_type" text NOT NULL
);
