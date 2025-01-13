import { integer, pgTable, varchar, boolean } from "drizzle-orm/pg-core";
import { timestamp, uuid, json } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations, type InferSelectModel } from "drizzle-orm";

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

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type User = InferSelectModel<typeof users>;

// #################################################################### //

// TUTOR PROFILE TABLE
export const tutorProfile = pgTable("tutorProfile", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  ssmlGender: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  languageCode: varchar({ length: 255 }).notNull(),

  // userId: varchar("userId").references(() => users.id),
});

export const insertTutorProfileSchema = createInsertSchema(tutorProfile);
export const selectTutorProfileSchema = createSelectSchema(tutorProfile);
export type TutorProfile = InferSelectModel<typeof tutorProfile>;

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

export const insertChatSchema = createInsertSchema(chats);
export const selectChatSchema = createSelectSchema(chats);
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

export const insertChatSettingsSchema = createInsertSchema(chatSettings);
export const selectChatSettingsSchema = createSelectSchema(chatSettings);
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
    .references(() => chats.id),
});

export const insertMessageSchema = createInsertSchema(messages);
export const selectMessageSchema = createSelectSchema(messages);
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

export const insertVocabularySetSchema = createInsertSchema(vocabularySets);
export const selectVocabularySetSchema = createSelectSchema(vocabularySets);
export type VocabularySet = InferSelectModel<typeof vocabularySets>;

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

export const insertFlashCardSchema = createInsertSchema(flashCards);
export const selectFlashCardSchema = createSelectSchema(flashCards);
export type FlashCard = InferSelectModel<typeof flashCards>;

// #################################################################### //

// RELATIONS
// export const tutorProfileRelations = relations(tutorProfile, ({ one }) => ({
//   user: one(users, { fields: [tutorProfile.userId], references: [users.id] }),
// }));

export const chatSettingsRelations = relations(chatSettings, ({ one }) => ({}));

// #################################################################### //
