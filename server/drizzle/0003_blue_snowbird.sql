ALTER TABLE "chats" RENAME COLUMN "title" TO "category";--> statement-breakpoint
ALTER TABLE "chats" ADD COLUMN "topic" varchar(255) NOT NULL;