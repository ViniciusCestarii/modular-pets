CREATE TABLE IF NOT EXISTS "pet"."species" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "species_name_unique" UNIQUE("name")
);
