CREATE TABLE "chatSettings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"autoCorrect" boolean NOT NULL,
	"autoRecord" boolean NOT NULL,
	"autoSend" boolean NOT NULL
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
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role" varchar(255) NOT NULL,
	"content" json NOT NULL,
	"usedTokens" integer NOT NULL,
	"createdAt" timestamp NOT NULL,
	"chatId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tutorProfiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ssmlGender" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"languageCode" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"imagePath" varchar(510) NOT NULL,
	"role" varchar(255) NOT NULL,
	"subscriptionExpiryDate" varchar(255) NOT NULL,
	"studingLanguageLevel" varchar(255) NOT NULL,
	"nativeLanguage" varchar(255) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatId_chats_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."chats"("id") ON DELETE no action ON UPDATE no action;