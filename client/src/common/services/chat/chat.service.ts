import { HttpError } from "@/common/services/api/rest-helper";
import { ServerAPI, serverApi } from "@/common/services/api/server-api";

const chatKey = ["chat"];

interface IChatService {
  getChatsHistory(): Promise<ChatsResponse>;
}

class ChatService implements IChatService {
  public serverApi: ServerAPI;

  constructor(serverApi: ServerAPI) {
    this.serverApi = serverApi;
  }

  public async getChatsHistory() {
    try {
      return (
        await this.serverApi.get<ChatsResponse>("/chats", {
          next: { tags: [chatKey.join()] },
        })
      ).data;
    } catch (error) {
      if (!(error instanceof HttpError)) {
        throw error;
      }

      throw error;
    }
  }
}

export const chatService = new ChatService(serverApi);

export type Chat = {
  id: string;
  title: string;
  usedTokens: number;
  startedAt: Date;
  userId: string;
};

export type ChatsResponse = Chat[] | null;
