import { Injectable, Logger } from '@nestjs/common';
import * as Redis from 'redis';
import { ServiceError } from '../../common/service-error';

@Injectable()
export class RedisService {
  public client: Redis.RedisClientType = Redis.createClient();
  private readonly logger = new Logger(RedisService.name);

  constructor() {
    this.cacheError();
  }

  public connect(): void {
    this.client
      .connect()
      .then(() => {
        this.logger.log('Redis connection established');
      })
      .catch((error: Error) => {
        throw ServiceError.RedisError(error.message, error.stack);
      });
  }

  //   private async connectionGuard(): Promise<void> {
  //     try {
  //       if (!this.client.isOpen) await this.client.connect();
  //     } catch (error: unknown) {
  //       if (error instanceof Error)
  //         throw ServiceError.RedisError({
  //           message: error.message,
  //           stack: error.stack,
  //         });
  //     }
  //   }
  private cacheError(): void {
    this.client.on('error', (error: unknown) => {
      this.logger.error(error);
    });
  }
}
