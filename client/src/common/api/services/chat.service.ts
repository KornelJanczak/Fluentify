import { HttpError } from "@/common/api/rest-helper";
import { ServerAPI, serverApi } from "@/common/api/server-api";
import { type Message } from "ai";

interface IChatService {
  getChatsHistory(): Promise<ChatsResponse>;
  getChatWithMessagesByChatId(chatId: string): Promise<ChatWithMessages | null>;
}

const chatKey = ["chat"];

class ChatService implements IChatService {
  private BASIC_PATH = "/chats";

  constructor(public serverApi: ServerAPI) {}

  public async getChatsHistory() {
    try {
      return (
        await this.serverApi.get<ChatsResponse>(this.BASIC_PATH, {
          next: { tags: [chatKey.join()] },
        })
      ).data;
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
          `/chat/${chatId}/messages`,
          {
            next: { tags: [chatKey.join()] },
          }
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
