import Queue, { Job, ProcessCallbackFunction } from "bull";
import { Logger } from "winston";
import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { config } from "@root/config";
import { Chat, Message } from "@services/db/schema";

type IBaseJobData = Message[];
let bullAdapters: BullAdapter[] = [];
export let serverAdapter: ExpressAdapter;
abstract class BaseQueue {
  protected queue: Queue.Queue;
  protected queueName: string;
  protected logger: Logger;
  // private serverAdapter: ExpressAdapter;
  // private static bullAdapters: BullAdapter[] = [];

  constructor(queueName: string) {
    // this.queue = new Queue(queueName, `${config.REDIS_HOST}`);
    // BaseQueue.bullAdapters.push(new BullAdapter(this.queue));
    // BaseQueue.bullAdapters = [...new Set(BaseQueue.bullAdapters)];
    // this.serverAdapter = new ExpressAdapter();
    // this.serverAdapter.setBasePath("queues");

    this.queue = new Queue(queueName, `${config.REDIS_HOST}`);
    bullAdapters.push(new BullAdapter(this.queue));
    bullAdapters = [...new Set(bullAdapters)];
    serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath("/queues");

    createBullBoard({
      queues: bullAdapters,
      serverAdapter: serverAdapter,
    });

    this.queue.on("completed", (job: Job) => {
      job.remove();
    });

    this.queue.on("global:completed", (jobId: string) => {
      this.logger.info(`Job ${jobId} completed`);
    });

    this.queue.on("global:stalled", (jobId: string) => {
      this.logger.info(`Job ${jobId} is stalled`);
    });
  }

  protected addJob(name: string, data: IBaseJobData): void {
    this.queue.add(name, data, {
      attempts: 3,
      backoff: { type: "fixed", delay: 5000 },
    });
  }

  protected processJob(
    name: string,
    concurrency: number,
    callback: ProcessCallbackFunction<void>
  ): void {
   
    this.queue.process(name, concurrency, callback);
  }
}

export default BaseQueue;
