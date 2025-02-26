ALTER TABLE "flashCards" DROP CONSTRAINT "flashCards_vocabularySetId_vocabularySets_id_fk";
--> statement-breakpoint
ALTER TABLE "flashCards" ADD CONSTRAINT "flashCards_vocabularySetId_vocabularySets_id_fk" FOREIGN KEY ("vocabularySetId") REFERENCES "public"."vocabularySets"("id") ON DELETE cascade ON UPDATE no action;