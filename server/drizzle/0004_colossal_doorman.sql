ALTER TABLE "chats" ADD COLUMN "vocabularySetId" uuid;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_vocabularySetId_vocabularySets_id_fk" FOREIGN KEY ("vocabularySetId") REFERENCES "public"."vocabularySets"("id") ON DELETE no action ON UPDATE no action;