CREATE TABLE IF NOT EXISTS "pet"."breeds" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"speciesId" uuid NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pet"."breeds" ADD CONSTRAINT "breeds_speciesId_species_id_fk" FOREIGN KEY ("speciesId") REFERENCES "pet"."species"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
