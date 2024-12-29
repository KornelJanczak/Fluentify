ALTER TABLE "tutorProfiles" RENAME TO "tutorProfile";--> statement-breakpoint
ALTER TABLE "tutorProfile" DROP CONSTRAINT "tutorProfiles_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "tutorProfile" ADD CONSTRAINT "tutorProfile_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;