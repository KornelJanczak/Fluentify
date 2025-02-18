import { eq } from "drizzle-orm";
import { db } from "../services/db";
import { type User, users } from "../services/db/schema";
import { ServiceError } from "@shared/errors/service.error";

interface IUserRepository {
  create(newUser: User): Promise<User>;
  getByEmail(email: string): Promise<User>;
  getById(id: string): Promise<User>;
}

class UserRepository implements IUserRepository {
  public async create(newUser: User): Promise<User> {
    try {
      const [createdUser]: User[] = await db
        .insert(users)
        .values(newUser)
        .returning();

      return createdUser;
    } catch (error) {
      throw ServiceError.DatabaseError({
        message: error.message,
        stack: error.stack,
      });
    }
  }

  public async getByEmail(email: string): Promise<User> {
    try {
      const [user]: User[] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      return user;
    } catch (error) {
      throw ServiceError.DatabaseError({
        message: error.message,
        stack: error.stack,
      });
    }
  }

  public async getById(id: string): Promise<User> {
    try {
      const [user]: User[] = await db
        .select()
        .from(users)
        .where(eq(users.id, id));

      return user;
    } catch (error) {
      throw ServiceError.DatabaseError({
        message: error.message,
        stack: error.stack,
      });
    }
  }
}

export default UserRepository;
