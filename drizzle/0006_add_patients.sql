CREATE SCHEMA "health";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "health"."patients" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"birthdate" date NOT NULL,
	"medicalObservations" varchar(1024),
	"sex" "sex" DEFAULT 'UNKNOWN' NOT NULL,
	"breed" varchar(255) NOT NULL,
	"specie" varchar(255) NOT NULL
);
