import { HttpError } from "@/common/api/rest-helper";
import { ServerAPI, serverApi } from "@/common/api/server-api";
import { ClientAPI, clientApi } from "@/common/api/client-api";
import { Message } from "ai";

export const getMessagesKey = ["chat"];

interface IMessageService {
  getMessagesByChatId(chatId: string): Promise<Array<Message>>;
}

class MessagesService implements IMessageService {
  private readonly serverApi: ServerAPI;
  private readonly clientApi: ClientAPI;

  constructor(serverApi: ServerAPI, clientAPI: ClientAPI) {
    this.serverApi = serverApi;
    this.clientApi = clientAPI;
  }

  async getMessagesByChatId(chatId: string): Promise<Array<Message>> {
    try {
      return (
        await this.serverApi.get<Array<Message>>(`/chat/${chatId}/messages`, {
          next: { tags: [getMessagesKey.join()] },
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

export const messagesService = new MessagesService(serverApi, clientApi);
