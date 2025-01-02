import { eq } from "drizzle-orm";
import { db } from "../services/db";
import { type TutorProfile, tutorProfile } from "../services/db/schema";
import DatabaseError from "../errors/dbError";

export interface ITutorProfileRepository {
  getTutorProfileByUserId(userId: string): Promise<TutorProfile>;
  createTutorProfile(
    newProfile: Omit<TutorProfile, "id">
  ): Promise<TutorProfile>;
  updateTutorProfileByUserId(
    userId: string,
    updatedProfile: Omit<TutorProfile, "id">
  ): Promise<TutorProfile>;
}

class TutorProfileRepository implements ITutorProfileRepository {
  private readonly fileName = "tutorProfileRepository";

  async getTutorProfileByUserId(userId: string): Promise<TutorProfile> {
    try {
      const [profile]: TutorProfile[] = await db
        .select()
        .from(tutorProfile)
        .where(eq(tutorProfile.userId, userId));

      return profile;
    } catch (error) {
      throw new DatabaseError({
        fileName: this.fileName,
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
        fileName: this.fileName,
        service: "createTutorProfile",
        message: error.message,
        stack: error.stack,
      });
    }
  }

  async updateTutorProfileByUserId(
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
        fileName: this.fileName,
        service: "updateTutorProfile",
        message: error.message,
        stack: error.stack,
      });
    }
  }
}

export default TutorProfileRepository;
