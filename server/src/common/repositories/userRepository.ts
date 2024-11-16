import { eq } from "drizzle-orm";
import { db } from "../db";
import { type User, users } from "../db/schema";
import DatabaseError from "../errors/dbError";
import logger from "../config/logger";

class UserRepository {
  async create(email: string, imagePaths: string) {
    const newUser = {
      email,
      imagePaths,
      role: "user",
      subscriptionExpiryDate: "",
    };

    try {
      const createdUser = await db.insert(users).values(newUser).returning();

      logger.info(createdUser);

      return createdUser;
    } catch (err) {
      throw new DatabaseError({
        message: err.message,
        stack: err.stack,
      });
    }
  }

  async getByEmail(email: string) {
    try {
      return await db.select().from(users).where(eq(users.email, email))[0];
    } catch (err) {
      throw new DatabaseError({
        message: err.message,
        stack: err.stack,
      });
    }
  }

  async getById(id: number) {
    try {
      return await db.select().from(users).where(eq(users.id, id))[0];
    } catch (err) {
      throw new DatabaseError({
        message: err.message,
        stack: err.stack,
      });
    }
  }
}

const userRepository = new UserRepository();
export default userRepository;
