CREATE SCHEMA "linkRec";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "linkRec"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(320) NOT NULL,
	"password" varchar(72) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
