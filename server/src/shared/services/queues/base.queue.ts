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
  protected abstract fileName: string;
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

    this.queue = new Queue(queueName, {
      redis: {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
      },
    });

    bullAdapters.push(new BullAdapter(this.queue));
    bullAdapters = [...new Set(bullAdapters)];
    serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath("/queues");

    createBullBoard({
      queues: bullAdapters,
      serverAdapter: serverAdapter,
    });

    this.queueListener();
  }

  protected addJob(name: string, data: IBaseJobData): void {
    this.logger.info({
      fileName: this.fileName,
      message: "Adding job to queue",
      service: "addJob",
    });

    this.queue.add(name, data, {
      attempts: 3,
      backoff: { type: "fixed" },
    });
  }

  protected processJob(
    name: string,
    concurrency: number,
    callback: ProcessCallbackFunction<void>
  ): void {
    this.logger.info({
      fileName: this.fileName,
      message: `Process ${name} job`,
      service: "processJob",
    });

    this.queue.process(name, concurrency, callback);
  }

  private queueListener(): void {
    this.queue.on("active", () => {
      this.logger.info({ message: "Job is active" });
    });

    this.queue.on("completed", (job: Job) => {
      job.remove();
    });

    this.queue.on("completed", (jobId: string) => {
      this.logger.info({ message: `Job ${jobId} completed` });
    });

    this.queue.on("stalled", (jobId: string) => {
      this.logger.info({ message: `Job ${jobId} is stalled` });
    });

    this.queue.on("error", (error: Error) => {
      this.logger.error({
        fileName: this.fileName,
        message: `Queue Error: ${error.message}`,
        service: "constructor",
      });
    });

    this.queue.isReady().then(() => {
      this.logger.info({
        fileName: this.fileName,
        message: "Queue is ready",
        service: "constructor",
      });
    });
  }
}

export default BaseQueue;
