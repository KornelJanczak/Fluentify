import { Module } from '@nestjs/common';
import { DrizzleAsyncProvider, drizzleProvider } from './db.provider';

@Module({
  providers: [...drizzleProvider],
  exports: [DrizzleAsyncProvider],
})
export class DbModule {}
