import { ServiceError } from "@shared/errors/service.error";
import { IMessagesRepository } from "@shared/repositories/messages.repository";
import { DoneCallback, Job } from "bull";
import { Logger } from "winston";

export interface IChatWorker {
  saveChatMessages(jobQueue: Job, done: DoneCallback): Promise<void>;
}

export interface IChatWorkerDependencies {
  messagesRepository: IMessagesRepository;
  logger: Logger;
}

class ChatWorker implements IChatWorker {
  private readonly logger: Logger;
  private readonly messagesRepository: IMessagesRepository;

  constructor({ messagesRepository, logger }: IChatWorkerDependencies) {
    this.logger = logger;
    this.messagesRepository = messagesRepository;

    console.log("messagesRepository - chat.worker", this.messagesRepository);
  }

  public async saveChatMessages(
    jobQueue: Job,
    done: DoneCallback
  ): Promise<void> {
    try {
      console.log("jobQueue.data", this.messagesRepository);
      await this.messagesRepository.saveMessages(jobQueue.data);
      jobQueue.progress(100);
      this.logger.info({ message: "Chat messages saved", data: jobQueue.data });
      return done(null, jobQueue.data);
    } catch (error) {
      return done(
        ServiceError.WorkerError({
          message: error.message,
          stack: error.stack,
        })
      );
    }
  }
}

export default ChatWorker;
