CREATE TYPE "public"."sex" AS ENUM('MALE', 'FEMALE', 'UNKNOWN');--> statement-breakpoint
ALTER TABLE "pet"."pets" ADD COLUMN "sex" "sex" DEFAULT 'UNKNOWN' NOT NULL;