import { eq } from "drizzle-orm";
import { db } from "../db";
import DatabaseError from "../errors/dbError";
import { PgTable, TableConfig, PgColumn } from "drizzle-orm/pg-core";

type ReturnValue = { [x: string]: unknown };

abstract class BaseRepository<T> {
  protected abstract table: PgTable<TableConfig>;
  protected abstract idColumn: PgColumn;

  async create(newItem: T, service: string): Promise<ReturnValue | []> {
    try {
      const [createdItem] = await db
        .insert(this.table)
        .values(newItem)
        .returning();

      return createdItem;
    } catch (err) {
      throw new DatabaseError({
        message: err.message,
        stack: err.stack,
        service,
      });
    }
  }

  async getById(id: string, service: string): Promise<ReturnValue | []> {
    try {
      const [item] = await db
        .select()
        .from(this.table)
        .where(eq(this.idColumn, id));

      return item;
    } catch (err) {
      throw new DatabaseError({
        message: err.message,
        stack: err.stack,
        service,
      });
    }
  }
}

export default BaseRepository;
