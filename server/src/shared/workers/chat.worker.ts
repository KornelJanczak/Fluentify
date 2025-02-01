import { IMessagesRepository } from "@shared/repositories/messages.repository";
import { DoneCallback, Job } from "bull";
import { log } from "console";
import { Logger } from "winston";

export interface IChatWorker {
  saveChatMessages(jobQueue: Job, done: DoneCallback): Promise<void>;
}

class ChatWorker {
  private readonly fileName = "chat.worker";
  private readonly logger: Logger;
  private readonly messageRepository: IMessagesRepository;

  async saveChatMessages(jobQueue: Job, done: DoneCallback) {
    try {
      console.log("jobQueue", "CHAT WORKER");

      await this.messageRepository.saveMessages(jobQueue.data);
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
