import { eq } from "drizzle-orm";
import { db } from "../db";
import DatabaseError from "../errors/dbError";
import { PgTable, TableConfig, PgColumn } from "drizzle-orm/pg-core";

type ReturnValue = { [x: string]: unknown };

type Create<T> = {
  newItem: T;
  service: string;
};

type GetById = {
  id: string;
  service: string;
};

abstract class BaseRepository<T> {
  protected abstract table: PgTable<TableConfig>;
  protected abstract idColumn: PgColumn;

  async create({ newItem, service }: Create<T>): Promise<ReturnValue | T[]> {
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

  async getById({ id, service }: GetById): Promise<ReturnValue | T[]> {
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
