ALTER TABLE "tutorProfiles" ADD COLUMN "userId" varchar;--> statement-breakpoint
ALTER TABLE "tutorProfiles" ADD CONSTRAINT "tutorProfiles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;