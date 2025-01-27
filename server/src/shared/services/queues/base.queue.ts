import { Queue, Job } from "bull";
import { Logger } from "winston";
import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { config } from "@root/config";

export interface IBaseQueueDependencies {
  queue: Queue;
  logger: Logger;
  serverAdapter: ExpressAdapter;
}

abstract class BaseQueue {
  protected queue: Queue;
  protected bullAdapters: BullAdapter[];
  protected serverAdapter: ExpressAdapter;
  protected logger: Logger;

  constructor({ queue, serverAdapter }: IBaseQueueDependencies) {
    this.queue = queue;
    this.bullAdapters.push(new BullAdapter(this.queue));
    this.serverAdapter = serverAdapter;
    this.serverAdapter.setBasePath(config.BULL_BASE_PATH);
  }
}

export default BaseQueue;
