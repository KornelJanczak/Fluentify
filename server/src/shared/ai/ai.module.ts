import { Module } from '@nestjs/common';
import { aiProvider, AiProvider } from './ai.provider';

@Module({
  providers: [...aiProvider],
  exports: [AiProvider],
})
export class AiModule {}
