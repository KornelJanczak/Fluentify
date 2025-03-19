import { timestamp, uuid, json, index } from 'drizzle-orm/pg-core';
import { relations, sql, type InferSelectModel } from 'drizzle-orm';
import { integer, pgTable, varchar, boolean } from 'drizzle-orm/pg-core';

// USERS TABLE
export const users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  imagePath: varchar({ length: 510 }).notNull(),
  role: varchar({ length: 255 }).notNull(),
  subscriptionExpiryDate: varchar({ length: 255 }).notNull(),
  studyingLanguageLevel: varchar({ length: 255 }).notNull(),
  nativeLanguage: varchar({ length: 255 }).notNull(),
  tutorId: varchar({ length: 255 }).notNull(),
});

// USERS RELATIONS
export const usersRelations = relations(users, ({ many }) => ({
  chats: many(chats),
  vocabularySets: many(vocabularySets),
}));

export type User = InferSelectModel<typeof users>;

// #################################################################### //

// CHAT TABLE
export const chats = pgTable('chats', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  usedTokens: integer(),
  startedAt: timestamp().notNull().defaultNow(),
  category: varchar({ length: 255 }).notNull(),
  topic: varchar({ length: 255 }).notNull(),
  userId: varchar('userId'),
  vocabularySetId: uuid('vocabularySetId').references(() => vocabularySets.id),
});

// CHATS RELATIONS
export const chatsRelations = relations(chats, ({ one, many }) => ({
  user: one(users, {
    fields: [chats.userId],
    references: [users.id],
  }),
  chatSettings: one(chatSettings),
  messages: many(messages),
  vocabularySets: one(vocabularySets),
}));

export type Chat = InferSelectModel<typeof chats>;

// #################################################################### //

// CHAT SETTINGS TABLE
export const chatSettings = pgTable('chatSettings', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  autoCorrect: boolean().notNull(),
  autoRecord: boolean().notNull(),
  autoSend: boolean().notNull(),
  chatId: uuid('chatId').references(() => chats.id),
});

// CHAT SETTINGS RELATIONS
export const chatSettingsRelations = relations(chatSettings, ({ one }) => ({
  chat: one(chats, {
    fields: [chatSettings.chatId],
    references: [chats.id],
  }),
}));

export type ChatSettings = InferSelectModel<typeof chatSettings>;

// #################################################################### //

// MESSAGE TABLE
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  role: varchar({ length: 255 }).notNull(),
  content: json('content').notNull(),
  usedTokens: integer(),
  createdAt: timestamp('createdAt').notNull(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => chats.id, { onDelete: 'cascade' }),
});

// MESSAGES RELATIONS
export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}));

export type Message = InferSelectModel<typeof messages>;

// #################################################################### //

// VOCABULARYSET TABLE
export const vocabularySets = pgTable(
  'vocabularySets',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    title: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }).notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    userId: varchar('userId').references(() => users.id),
  },
  (table) => [
    index('title_search_index').using(
      'gin',
      sql`to_tsvector('english', ${table.title})`,
    ),
  ],
);

// VOCABULARYSET RELATIONS
export const vocabularySetsRelations = relations(
  vocabularySets,
  ({ one, many }) => ({
    user: one(users, {
      fields: [vocabularySets.userId],
      references: [users.id],
    }),
    flashCards: many(flashCards),
  }),
);

export type VocabularySet = InferSelectModel<typeof vocabularySets>;
export type VocabularySetWithoutId = Omit<VocabularySet, 'id' | 'createdAt'>;

// #################################################################### //

// FLASHCARDS TABLE
export const flashCards = pgTable('flashCards', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  definition: varchar({ length: 255 }).notNull(),
  translation: varchar({ length: 255 }).notNull(),
  vocabularySetId: uuid('vocabularySetId')
    .notNull()
    .references(() => vocabularySets.id, { onDelete: 'cascade' }),
});

// FLASHCARDS RELATIONS
export const flashCardsRelations = relations(flashCards, ({ one }) => ({
  vocabularySet: one(vocabularySets, {
    fields: [flashCards.vocabularySetId],
    references: [vocabularySets.id],
  }),
}));

export type FlashCard = InferSelectModel<typeof flashCards>;
export type FlashCardWithoutIds = Omit<FlashCard, 'id' | 'vocabularySetId'>;

// #################################################################### //
