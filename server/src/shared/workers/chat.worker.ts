import { IMessagesRepository } from "@shared/repositories/messages.repository";
import { DoneCallback, Job } from "bull";
import { log } from "console";
import { Logger } from "winston";

export interface IChatWorker {
  saveChatMessages(jobQueue: Job, done: DoneCallback): Promise<void>;
}

export interface IChatWorkerDependencies {
  messagesRepository: IMessagesRepository;
  logger: Logger;
}

class ChatWorker implements IChatWorker {
  private readonly fileName = "chat.worker";
  private readonly logger: Logger;
  private readonly messagesRepository: IMessagesRepository;

  constructor({ messagesRepository, logger }: IChatWorkerDependencies) {
    this.logger = logger;
    this.messagesRepository = messagesRepository;
  }

  async saveChatMessages(jobQueue: Job, done: DoneCallback): Promise<void> {
    await this.messagesRepository.saveMessages(jobQueue.data);

    try {
      console.log("jobQueue", "CHAT WORKER");

      jobQueue.progress(100);
      this.logger.info({ message: "Chat messages saved", data: jobQueue.data });
      done(null, jobQueue.data);
    } catch (error) {
      this.logger.error({
        fileName: this.fileName,
        service: "saveChatMessages",
        message: error.message,
        stack: error.stack,
      });
      done(error as Error);
    }
  }
}

export default ChatWorker;
