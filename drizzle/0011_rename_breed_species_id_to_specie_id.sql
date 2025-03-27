ALTER TABLE "pet"."breeds" RENAME COLUMN "speciesId" TO "specieId";--> statement-breakpoint
ALTER TABLE "pet"."breeds" DROP CONSTRAINT "breeds_name_speciesId_unique";--> statement-breakpoint
ALTER TABLE "pet"."breeds" DROP CONSTRAINT "breeds_speciesId_species_id_fk";
--> statement-breakpoint
ALTER TABLE "pet"."breeds" ADD CONSTRAINT "breeds_specieId_species_id_fk" FOREIGN KEY ("specieId") REFERENCES "pet"."species"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet"."breeds" ADD CONSTRAINT "breeds_name_specieId_unique" UNIQUE("name","specieId");