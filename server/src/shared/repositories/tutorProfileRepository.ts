import { eq } from "drizzle-orm";
import { db } from "../services/db";
import { type TutorProfile, tutorProfile } from "../services/db/schema";
import DatabaseError from "../errors/dbError";

const fileName = "tutorProfileRepository";

class TutorProfileRepository {
  async getTutorProfileByUserId(userId: string): Promise<TutorProfile> {
    try {
      const [profile]: TutorProfile[] = await db
        .select()
        .from(tutorProfile)
        .where(eq(tutorProfile.userId, userId));

      return profile;
    } catch (error) {
      throw new DatabaseError({
        fileName,
        service: "getTutorByUserId",
        message: error.message,
        stack: error.stack,
      });
    }
  }

  async createTutorProfile(
    newProfile: Omit<TutorProfile, "id">
  ): Promise<TutorProfile> {
    try {
      const [createdProfile]: TutorProfile[] = await db
        .insert(tutorProfile)
        .values(newProfile)
        .returning();

      return createdProfile;
    } catch (error) {
      throw new DatabaseError({
        fileName,
        service: "createTutorProfile",
        message: error.message,
        stack: error.stack,
      });
    }
  }

  async updateTutorProfile(
    userId: string,
    updatedProfile: Omit<TutorProfile, "id">
  ): Promise<TutorProfile> {
    try {
      const [profile]: TutorProfile[] = await db
        .update(tutorProfile)
        .set(updatedProfile)
        .where(eq(tutorProfile.userId, userId))
        .returning();

      return profile;
    } catch (error) {
      throw new DatabaseError({
        fileName,
        service: "updateTutorProfile",
        message: error.message,
        stack: error.stack,
      });
    }
  }
}

export const tutorProfileRepository = new TutorProfileRepository();
