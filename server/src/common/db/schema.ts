import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { type InferSelectModel, relations } from "drizzle-orm";
import { boolean } from "drizzle-orm/mysql-core";

// USER TABLE
export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  imagePaths: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 50 }).notNull(),
  subscriptionExpiryDate: varchar({ length: 50 }).notNull(),
  // chats: integer().references(() => chats.id),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export type User = InferSelectModel<typeof users>;
// #################################################################### //

// CHAT TABLE
export const chats = pgTable("chats", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  usedTokens: integer().notNull(),
  startedAt: timestamp().notNull(),
  workspaceId: varchar({ length: 255 }).notNull(),
  userId: integer("userId"),
});

export const insertChatSchema = createInsertSchema(chats);
export const selectChatSchema = createSelectSchema(chats);

export type Chat = InferSelectModel<typeof chats>;

// #################################################################### //

// MESSAGE TABLE
export const messages = pgTable("messages", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  content: varchar({ length: 255 }).notNull(),
  usedTokens: integer().notNull(),
  userId: integer("userId"),
  chatId: integer("chatId"),
});

export const insertMessageSchema = createInsertSchema(messages);
export const selectMessageSchema = createSelectSchema(messages);

export type Message = InferSelectModel<typeof messages>;

// #################################################################### //

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  chats: many(chats),
}));

export const chatRelations = relations(chats, ({ one, many }) => ({
  user: one(users, {
    fields: [chats.userId],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats),
}));
