import { IChatWorker } from "@shared/workers/chat.worker";
import BaseQueue from "./base.queue";
import { Chat, Message } from "@services/db/schema";
import { Logger } from "winston";

export interface IChatQueueDependencies {
  chatWorker: IChatWorker;
  logger: Logger;
}

class ChatQueue extends BaseQueue {
  protected fileName: string = "chat.queue";
  private readonly chatWorker: IChatWorker;

  constructor({ chatWorker, logger }: IChatQueueDependencies) {
    super("chat");
    this.chatWorker = chatWorker;
    this.logger = logger;
    this.logger.info({
      fileName: this.fileName,
      service: "constructor",
      message: "ChatQueue initialized",
    });
    this.processJob(
      "saveChatMessages",
      5,
      this.chatWorker.saveChatMessages.bind(this.chatWorker)
    );
  }

  public addChatJob(name: string, data: Message[]) {
    this.addJob(name, data);
  }
}

export default ChatQueue;
