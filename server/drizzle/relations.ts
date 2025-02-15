import { relations } from "drizzle-orm/relations";
import { users, chats, chatSettings, vocabularySets, flashCards, messages } from "./schema";

export const chatsRelations = relations(chats, ({one, many}) => ({
	user: one(users, {
		fields: [chats.userId],
		references: [users.id]
	}),
	chatSettings: many(chatSettings),
	messages: many(messages),
}));

export const usersRelations = relations(users, ({many}) => ({
	chats: many(chats),
	vocabularySets: many(vocabularySets),
}));

export const chatSettingsRelations = relations(chatSettings, ({one}) => ({
	chat: one(chats, {
		fields: [chatSettings.chatId],
		references: [chats.id]
	}),
}));

export const vocabularySetsRelations = relations(vocabularySets, ({one, many}) => ({
	user: one(users, {
		fields: [vocabularySets.userId],
		references: [users.id]
	}),
	flashCards: many(flashCards),
}));

export const flashCardsRelations = relations(flashCards, ({one}) => ({
	vocabularySet: one(vocabularySets, {
		fields: [flashCards.vocabularySetId],
		references: [vocabularySets.id]
	}),
}));

export const messagesRelations = relations(messages, ({one}) => ({
	chat: one(chats, {
		fields: [messages.chatId],
		references: [chats.id]
	}),
}));