import { eq } from "drizzle-orm";
import { db } from "../db";
import { type User, users } from "../db/schema";
import DatabaseError from "../errors/dbError";

class UserRepository {
  async create(newUser: User): Promise<User> {
    try {
      const [createdUser]: User[] = await db
        .insert(users)
        .values(newUser)
        .returning();

      return createdUser;
    } catch (err) {
      throw new DatabaseError({
        message: err.message,
        stack: err.stack,
      });
    }
  }

  async getByEmail(email: string): Promise<User> {
    try {
      const [user]: User[] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      return user;
    } catch (err) {
      throw new DatabaseError({
        message: err.message,
        stack: err.stack,
      });
    }
  }

  async getById(id: string): Promise<User> {
    try {
      const [user]: User[] = await db
        .select()
        .from(users)
        .where(eq(users.id, id));

      return user;
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
