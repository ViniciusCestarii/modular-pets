CREATE SCHEMA "shared";
--> statement-breakpoint
CREATE TABLE "shared"."images" (
	"id" uuid PRIMARY KEY NOT NULL,
	"src" varchar NOT NULL,
	"ownerId" uuid NOT NULL,
	"ownerType" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE INDEX "ownerId_idx" ON "shared"."images" USING btree ("ownerId");