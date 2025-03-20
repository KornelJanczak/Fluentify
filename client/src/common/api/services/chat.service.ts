import { HttpError } from "@/common/api/rest-helper";
import { ServerAPI, serverApi } from "@/common/api/server-api";
import { type Message } from "ai";

interface IChatService {
  getChatsHistory(): Promise<ChatsResponse>;
  getChatWithMessagesByChatId(chatId: string): Promise<ChatWithMessages | null>;
}


class ChatService implements IChatService {
  private BASIC_PATH = "/chat";

  constructor(public serverApi: ServerAPI) {}

  public async getChatsHistory() {
    try {
      return (await this.serverApi.get<ChatsResponse>(this.BASIC_PATH)).data;
    } catch (error) {
      if (!(error instanceof HttpError)) throw error;

      throw error;
    }
  }

  public async getChatWithMessagesByChatId(
    chatId: string
  ): Promise<ChatWithMessages | null> {
    try {
      return (
        await this.serverApi.get<ChatWithMessages | null>(
          `/chat/${chatId}/messages`
        )
      ).data;
    } catch (error) {
      if (!(error instanceof HttpError)) throw error;

      throw error;
    }
  }
}

export const chatService = new ChatService(serverApi);

export type Chat = {
  id: string;
  category: string;
  usedTokens: number;
  startedAt: Date;
  topic: string;
  vocabularySetId: string;
  userId: string;
};

export type ChatWithMessages = Chat & {
  messages: Message[];
};

export type ChatsResponse = Chat[] | null;
