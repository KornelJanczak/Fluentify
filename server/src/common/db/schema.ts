import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { type InferSelectModel } from "drizzle-orm";

// USER TABLE
export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  imagePaths: varchar({ length: 510 }).notNull(),
  role: varchar({ length: 255 }).notNull(),
  subscriptionExpiryDate: varchar({ length: 255 }).notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export type User = InferSelectModel<typeof users>;

// #################################################################### //

// CHAT TABLE
export const chats = pgTable("chats", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  usedTokens: integer().notNull(),
  startedAt: timestamp().notNull(),
  workspaceId: varchar({ length: 255 }).notNull(),
  userId: varchar("userId")
    .notNull()
    .references(() => users.id),
});

export const insertChatSchema = createInsertSchema(chats);
export const selectChatSchema = createSelectSchema(chats);

export type Chat = InferSelectModel<typeof chats>;

// #################################################################### //

// MESSAGE TABLE
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chats.id),
  content: varchar({ length: 255 }).notNull(),
  usedTokens: integer().notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export const insertMessageSchema = createInsertSchema(messages);
export const selectMessageSchema = createSelectSchema(messages);

export type Message = InferSelectModel<typeof messages>;
