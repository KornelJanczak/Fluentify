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
});

// USERS RELATIONS
export const usersRelations = relations(users, ({ many, one }) => ({
  chats: many(chats),
  vocabularySets: many(vocabularySets),
  settings: one(settings, {
    fields: [users.id],
    references: [settings.userId],
  }),
}));

export type User = InferSelectModel<typeof users>;

// #################################################################### //

// SETTINGS TABLE
export const settings = pgTable('settings', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  learningLanguage: varchar({ length: 255 }).notNull(),
  learningLanguageLevel: varchar({ length: 255 }).notNull(),
  nativeLanguage: varchar({ length: 255 }).notNull(),
  tutorId: varchar({ length: 255 }).notNull(),
  autoCorrect: boolean(),
  autoRecord: boolean(),
  autoSend: boolean(),
  userId: varchar('userId').references(() => users.id),
  // chatId: uuid('chatId').references(() => chats.id),
});

export type Settings = InferSelectModel<typeof settings>;

// SETTINGS RELATIONS
export const settingsRelations = relations(settings, ({ one }) => ({
  user: one(users, {
    fields: [settings.userId],
    references: [users.id],
  }),
  chat: one(chats, {
    fields: [settings.id],
    references: [chats.settingsId],
  }),
}));

// #################################################################### //

// CHAT TABLE
export const chats = pgTable('chats', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  startedAt: timestamp().notNull().defaultNow(),
  category: varchar({ length: 255 }).notNull(),
  topic: varchar({ length: 255 }).notNull(),
  userId: varchar('userId').references(() => users.id, {
    onDelete: 'cascade',
  }),
  settingsId: uuid('settingsId').references(() => settings.id),
  vocabularySetId: uuid('vocabularySetId').references(() => vocabularySets.id, {
    onDelete: 'set null',
  }),
});

// CHATS RELATIONS
export const chatsRelations = relations(chats, ({ one, many }) => ({
  user: one(users, {
    fields: [chats.userId],
    references: [users.id],
  }),
  settings: one(settings, {
    fields: [chats.settingsId],
    references: [settings.id],
  }),
  messages: many(messages),
  vocabularySet: one(vocabularySets, {
    fields: [chats.vocabularySetId],
    references: [vocabularySets.id],
  }),
}));

export type Chat = InferSelectModel<typeof chats>;

// #################################################################### //

// MESSAGE TABLE
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  role: varchar({ length: 255 }).notNull(),
  content: json('content').notNull(),
  usedTokens: integer(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
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
    userId: varchar('userId').references(() => users.id, {
      onDelete: 'cascade',
    }),
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
