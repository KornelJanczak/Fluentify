import { eq } from "drizzle-orm";
import { db } from "../services/db";
import DatabaseError from "../errors/dbError";
import { PgTable, TableConfig, PgColumn } from "drizzle-orm/pg-core";

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
    } catch (error) {
      throw new DatabaseError({
        service,
        ...error,
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
    } catch (error) {
      throw new DatabaseError({
        service,
        ...error,
      });
    }
  }
}

export default BaseRepository;

type ReturnValue = { [x: string]: unknown };

type Create<T> = {
  newItem: T;
  service: string;
};

type GetById = {
  id: string;
  service: string;
};
