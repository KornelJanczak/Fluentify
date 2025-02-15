import { pgTable, foreignKey, uuid, varchar, integer, timestamp, boolean, unique, json } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const chats = pgTable("chats", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	usedTokens: integer().notNull(),
	startedAt: timestamp({ mode: 'string' }).notNull(),
	userId: varchar().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "chats_userId_users_id_fk"
		}),
]);

export const chatSettings = pgTable("chatSettings", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	autoCorrect: boolean().notNull(),
	autoRecord: boolean().notNull(),
	autoSend: boolean().notNull(),
	chatId: uuid(),
}, (table) => [
	foreignKey({
			columns: [table.chatId],
			foreignColumns: [chats.id],
			name: "chatSettings_chatId_chats_id_fk"
		}),
]);

export const users = pgTable("users", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	imagePath: varchar({ length: 510 }).notNull(),
	role: varchar({ length: 255 }).notNull(),
	subscriptionExpiryDate: varchar({ length: 255 }).notNull(),
	studyingLanguageLevel: varchar({ length: 255 }).notNull(),
	nativeLanguage: varchar({ length: 255 }).notNull(),
	tutorId: varchar({ length: 255 }).notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const vocabularySets = pgTable("vocabularySets", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	description: varchar({ length: 255 }).notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	userId: varchar(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "vocabularySets_userId_users_id_fk"
		}),
]);

export const flashCards = pgTable("flashCards", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	definition: varchar({ length: 255 }).notNull(),
	translation: varchar({ length: 255 }).notNull(),
	vocabularySetId: uuid().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.vocabularySetId],
			foreignColumns: [vocabularySets.id],
			name: "flashCards_vocabularySetId_vocabularySets_id_fk"
		}),
]);

export const messages = pgTable("messages", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	role: varchar({ length: 255 }).notNull(),
	content: json().notNull(),
	usedTokens: integer().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	chatId: uuid().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.chatId],
			foreignColumns: [chats.id],
			name: "messages_chatId_chats_id_fk"
		}).onDelete("cascade"),
]);
