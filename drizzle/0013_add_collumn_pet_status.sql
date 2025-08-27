CREATE TYPE "public"."status" AS ENUM('ACTIVE', 'INACTIVE', 'ADOPTED');--> statement-breakpoint
ALTER TABLE "pet"."pets" ADD COLUMN "status" "status" DEFAULT 'ACTIVE' NOT NULL;