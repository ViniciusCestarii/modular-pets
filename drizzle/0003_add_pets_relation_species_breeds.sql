ALTER TABLE "pet"."pets" ADD COLUMN "breedId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "pet"."pets" ADD COLUMN "speciesId" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pet"."pets" ADD CONSTRAINT "pets_breedId_breeds_id_fk" FOREIGN KEY ("breedId") REFERENCES "pet"."breeds"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pet"."pets" ADD CONSTRAINT "pets_speciesId_species_id_fk" FOREIGN KEY ("speciesId") REFERENCES "pet"."species"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
