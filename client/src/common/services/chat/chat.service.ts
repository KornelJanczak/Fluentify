import { HttpError } from "@/common/services/api/rest-helper";
import { ServerAPI, serverApi } from "@/common/services/api/server-api";

interface IChatService {
  getChatsHistory(): Promise<ChatsResponse>;
}

const chatKey = ["chat"];

class ChatService implements IChatService {
  public serverApi: ServerAPI;
  private BASIC_PATH = "/chats";

  constructor(serverApi: ServerAPI) {
    this.serverApi = serverApi;
  }

  public async getChatsHistory() {
    try {
      return (
        await this.serverApi.get<ChatsResponse>(this.BASIC_PATH, {
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
