import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatStreamService } from './services/chat-stream.service';
import { AudioGeneratorService } from './services/audio-generator.service';
import { SystemPromptService } from './services/system-prompt.service';
import { TutorPromptService } from './services/tutor-prompt.service';
import { ChatRepository } from 'src/shared/repositories/chat.repository';
import { DbModule } from 'src/shared/db/db.module';
import { AiModule } from 'src/shared/ai/ai.module';
import { TopicPromptFactoryService } from './services/topic-prompt-factory.service';
import VocabularySetRepository from 'src/shared/repositories/vocabulary-set.repository';
import { AudioUploaderService } from './services/audio-uploader.service';

@Module({
  imports: [DbModule, AiModule],
  providers: [
    ChatRepository,
    VocabularySetRepository,
    ChatService,
    ChatStreamService,
    AudioGeneratorService,
    AudioUploaderService,
    SystemPromptService,
    TutorPromptService,
    TopicPromptFactoryService,
  ],
  controllers: [ChatController],
})
export class ChatModule {}
