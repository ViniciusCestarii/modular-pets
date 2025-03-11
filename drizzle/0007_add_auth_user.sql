CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE TABLE "auth"."users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"birthdate" date NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
