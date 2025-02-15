CREATE TABLE "chatSettings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"autoCorrect" boolean NOT NULL,
	"autoRecord" boolean NOT NULL,
	"autoSend" boolean NOT NULL,
	"chatId" uuid
);
--> statement-breakpoint
CREATE TABLE "chats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"usedTokens" integer NOT NULL,
	"startedAt" timestamp NOT NULL,
	"userId" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "flashCards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"definition" varchar(255) NOT NULL,
	"translation" varchar(255) NOT NULL,
	"vocabularySetId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role" varchar(255) NOT NULL,
	"content" json NOT NULL,
	"usedTokens" integer NOT NULL,
	"createdAt" timestamp NOT NULL,
	"chatId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"imagePath" varchar(510) NOT NULL,
	"role" varchar(255) NOT NULL,
	"subscriptionExpiryDate" varchar(255) NOT NULL,
	"studyingLanguageLevel" varchar(255) NOT NULL,
	"nativeLanguage" varchar(255) NOT NULL,
	"tutorId" varchar(255) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vocabularySets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"createdAt" timestamp NOT NULL,
	"userId" varchar
);
--> statement-breakpoint
ALTER TABLE "chatSettings" ADD CONSTRAINT "chatSettings_chatId_chats_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."chats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flashCards" ADD CONSTRAINT "flashCards_vocabularySetId_vocabularySets_id_fk" FOREIGN KEY ("vocabularySetId") REFERENCES "public"."vocabularySets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatId_chats_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocabularySets" ADD CONSTRAINT "vocabularySets_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;