ALTER TABLE "users" DROP CONSTRAINT "users_company_unique";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "firstName" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "lastName" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "company" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "image" text;