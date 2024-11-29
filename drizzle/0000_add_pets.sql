CREATE SCHEMA "pet";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pet"."pets" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"birthdate" date NOT NULL
);
