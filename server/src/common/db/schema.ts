import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { timestamp, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  imagePaths: varchar({ length: 50 }).notNull(),
  role: varchar({ length: 50 }).notNull(),
  subscriptionExpiryDate: varchar({ length: 50 }).notNull(),
  chats: integer().references(() => chatsTable.id),
});

export const chatsTable = pgTable("chats", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  usedTokens: integer().notNull(),
  startedAt: timestamp().notNull(),
  workspaceId: varchar({ length: 255 }).notNull(),
  userId: integer().references(() => usersTable.id),
});

export const messagesTable = pgTable("messages", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  content: varchar({ length: 255 }).notNull(),
  usedTokens: integer().notNull(),
  chatId: integer().references(() => chatsTable.id),
});
