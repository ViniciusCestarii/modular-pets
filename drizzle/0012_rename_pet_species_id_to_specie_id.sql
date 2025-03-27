ALTER TABLE "pet"."pets" RENAME COLUMN "speciesId" TO "specieId";--> statement-breakpoint
ALTER TABLE "pet"."pets" DROP CONSTRAINT "pets_speciesId_species_id_fk";
--> statement-breakpoint
ALTER TABLE "pet"."pets" ADD CONSTRAINT "pets_specieId_species_id_fk" FOREIGN KEY ("specieId") REFERENCES "pet"."species"("id") ON DELETE no action ON UPDATE no action;