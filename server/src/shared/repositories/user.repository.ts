import { eq } from 'drizzle-orm';
import { type User, users } from '../db/db.schema';
import { ServiceError } from 'src/common/service-error';
import { Inject, Injectable } from '@nestjs/common';
import { type Drizzle, DrizzleAsyncProvider } from '../db/db.provider';

@Injectable()
class UserRepository {
  constructor(@Inject(DrizzleAsyncProvider) private db: Drizzle) {}

  public async create(newUser: User): Promise<User> {
    try {
      const [createdUser] = await this.db
        .insert(users)
        .values(newUser)
        .returning();

      return createdUser;
    } catch (error) {
      throw ServiceError.DatabaseError(error.message, error.stack);
    }
  }

  public async getByEmail(email: string): Promise<User> {
    try {
      const [user] = await this.db
        .select()
        .from(users)
        .where(eq(users.email, email));

      return user;
    } catch (error) {
      throw ServiceError.DatabaseError(error.message, error.stack);
    }
  }

  public async getById(id: string): Promise<User> {
    try {
      const [user] = await this.db.select().from(users).where(eq(users.id, id));

      return user;
    } catch (error) {
      throw ServiceError.DatabaseError(error.message, error.stack);
    }
  }
}

export default UserRepository;
