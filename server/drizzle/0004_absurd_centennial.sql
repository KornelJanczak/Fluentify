CREATE TABLE "flashCards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"definition" varchar(255) NOT NULL,
	"translation" varchar(255) NOT NULL,
	"vocabularySetId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vocabularySets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"userId" varchar
);
--> statement-breakpoint
ALTER TABLE "flashCards" ADD CONSTRAINT "flashCards_vocabularySetId_vocabularySets_id_fk" FOREIGN KEY ("vocabularySetId") REFERENCES "public"."vocabularySets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocabularySets" ADD CONSTRAINT "vocabularySets_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;