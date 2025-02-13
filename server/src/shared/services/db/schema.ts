// import { integer, pgTable, varchar, boolean } from "drizzle-orm/pg-core";
import { timestamp, uuid, json } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations, type InferSelectModel } from "drizzle-orm";
import { integer, pgTable, varchar, boolean } from "drizzle-orm/pg-core";

// USER TABLE
export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  imagePath: varchar({ length: 510 }).notNull(),
  role: varchar({ length: 255 }).notNull(),
  subscriptionExpiryDate: varchar({ length: 255 }).notNull(),
  studyingLanguageLevel: varchar({ length: 255 }).notNull(),
  nativeLanguage: varchar({ length: 255 }).notNull(),
  tutorId: varchar({ length: 255 }).notNull(),
});

export type User = InferSelectModel<typeof users>;

// #################################################################### //

// CHAT TABLE
export const chats = pgTable("chats", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  title: varchar({ length: 255 }).notNull(),
  usedTokens: integer().notNull(),
  startedAt: timestamp().notNull(),
  userId: varchar("userId")
    .notNull()
    .references(() => users.id),
});

export type Chat = InferSelectModel<typeof chats>;

// #################################################################### //

// CHAT SETTINGS TABLE
export const chatSettings = pgTable("chatSettings", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  autoCorrect: boolean().notNull(),
  autoRecord: boolean().notNull(),
  autoSend: boolean().notNull(),
  chatId: uuid("chatId").references(() => chats.id),
});

export type ChatSettings = InferSelectModel<typeof chatSettings>;

// #################################################################### //

// MESSAGE TABLE
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  role: varchar({ length: 255 }).notNull(),
  content: json("content").notNull(),
  usedTokens: integer().notNull(),
  createdAt: timestamp("createdAt").notNull(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chats.id, { onDelete: "cascade" }),
});

export type Message = InferSelectModel<typeof messages>;

// #################################################################### //

// VOCABULARYSET TABLE
export const vocabularySets = pgTable("vocabularySets", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("createdAt").notNull(),
  userId: varchar("userId").references(() => users.id),
});

export type VocabularySet = InferSelectModel<typeof vocabularySets>;
export type VocabularySetWithoutId = Omit<VocabularySet, "id">;

// #################################################################### //

// FLASHCARDS TABLE
export const flashCards = pgTable("flashCards", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  definition: varchar({ length: 255 }).notNull(),
  translation: varchar({ length: 255 }).notNull(),
  vocabularySetId: uuid("vocabularySetId")
    .notNull()
    .references(() => vocabularySets.id),
});

export type FlashCard = InferSelectModel<typeof flashCards>;
export type FlashCardWithoutIds = Omit<FlashCard, "id" | "vocabularySetId">;

// #################################################################### //

// RELATIONS
export const chatSettingsRelations = relations(chatSettings, ({ one }) => ({}));

// #################################################################### //
