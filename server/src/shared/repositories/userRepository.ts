import { eq } from "drizzle-orm";
import { db } from "../services/db";
import { type User, users } from "../services/db/schema";
import DatabaseError from "../errors/dbError";

interface IUserRepository {
  create(newUser: User): Promise<User>;
  getByEmail(email: string): Promise<User>;
  getById(id: string): Promise<User>;
}

class UserRepository implements IUserRepository {
  private readonly fileName = "userRepository";
  async create(newUser: User): Promise<User> {
    try {
      const [createdUser]: User[] = await db
        .insert(users)
        .values(newUser)
        .returning();

      return createdUser;
    } catch (error) {
      throw new DatabaseError({
        fileName: this.fileName,
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
        fileName: this.fileName,
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
        fileName: this.fileName,
        service: "getById",
        message: error.message,
        stack: error.stack,
      });
    }
  }
}

export default UserRepository;
