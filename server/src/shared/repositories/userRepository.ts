import { eq } from "drizzle-orm";
import { db } from "../services/db";
import { type User, users } from "../services/db/schema";
import DatabaseError from "../errors/dbError";

const fileName = "userRepository";

class UserRepository {
  async create(newUser: User): Promise<User> {
    try {
      const [createdUser]: User[] = await db
        .insert(users)
        .values(newUser)
        .returning();

      return createdUser;
    } catch (error) {
      throw new DatabaseError({
        fileName,
        service: "create",
        message: error.message,
        stack: error.stack,
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
    } catch (error) {
      throw new DatabaseError({
        fileName,
        service: "getByEmail",
        message: error.message,
        stack: error.stack,
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
    } catch (error) {
      throw new DatabaseError({
        fileName,
        service: "getById",
        message: error.message,
        stack: error.stack,
      });
    }
  }
}

const userRepository = new UserRepository();
export default userRepository;
