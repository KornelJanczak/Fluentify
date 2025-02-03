import InternalServerError from "@shared/errors/internalServer.error";
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

    console.log("messagesRepository - chat.worker", this.messagesRepository);
  }

  async saveChatMessages(jobQueue: Job, done: DoneCallback): Promise<void> {
    try {
      console.log("jobQueue.data", this.messagesRepository);
      await this.messagesRepository.saveMessages(jobQueue.data);
      jobQueue.progress(100);
      this.logger.info({ message: "Chat messages saved", data: jobQueue.data });
      return done(null, jobQueue.data);
    } catch (error) {
      return done(
        new InternalServerError({
          fileName: this.fileName,
          message: error.message,
          stack: error.stack,
          service: "saveChatMessages",
        })
      );
    }
  }
}

export default ChatWorker;
