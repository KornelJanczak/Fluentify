import { IChatRepository } from "@shared/repositories/chatRepository";
import { IMessagesRepository } from "@shared/repositories/messagesRepository";
import { DoneCallback, Job } from "bull";
import { Logger } from "winston";

class ChatWorker {
  private logger: Logger;

  private messageRepository: IMessagesRepository;

  async saveChatMessages(jobQueue: Job, done: DoneCallback) {
    try {
      await this.messageRepository.saveMessages(jobQueue.data);
      jobQueue.progress(100);
      done(null, jobQueue.data);
    } catch (error) {
      // done(new);
    }
  }
}

export default ChatWorker;
