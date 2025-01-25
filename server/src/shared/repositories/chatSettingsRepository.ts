// import { eq } from "drizzle-orm";
import { db } from "../services/db";
import { type ChatSettings, chatSettings } from "../services/db/schema";
import DatabaseError from "../errors/dbError";

const fileName = "chatSettingsRepository";

class ChatSettingsRepository {
   async getChatSettings(){}
}

export const chatSettingsRepository = new ChatSettingsRepository();
