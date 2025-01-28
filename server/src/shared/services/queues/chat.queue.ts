import { IChatWorker } from "@shared/workers/chat.worker";
import BaseQueue from "./base.queue";
import { Chat, Message } from "@services/db/schema";

export interface IChatQueueDependencies {
  chatWorker: IChatWorker;
}

class ChatQueue extends BaseQueue {
  private readonly chatWorker: IChatWorker;

  constructor({ chatWorker }: IChatQueueDependencies) {
    super("chat");
    this.chatWorker = chatWorker;
    this.processJob("saveChatMessages", 5, this.chatWorker.saveChatMessages);
  }

  public addChatJob(name: string, data: Message[]): void {
    this.addJob(name, data);
  }
}

export default ChatQueue;
