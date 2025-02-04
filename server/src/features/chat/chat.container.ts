import {
  createContainer,
  asClass,
  InjectionMode,
  asFunction,
  asValue,
} from "awilix";
import ChatController from "./chat.controller";
import ChatStreamService from "./chat.services/chatStream.service";
import AudioGeneratorService from "./chat.services/audioGenerator.service";
import TopicPromptFactory from "./chat.services/topicPrompt.service/topicPromptFactory";
import ChatRepository from "@shared/repositories/chat.repository";
import MessagesRepository from "@shared/repositories/messages.repository";
import FlashCardRepository from "@shared/repositories/flashCard.repository";
import { config } from "@root/config";
import SystemPromptService from "./chat.services/systemPrompt.service";
import TutorPromptService from "./chat.services/tutorPrompt.service";
import ChatQueue from "@services/queues/chat.queue";
import ChatWorker from "@shared/workers/chat.worker";
import ChatCache from "@services/redis/chat.cache";
import { client as redisClient } from "@services/redis/redis.client";

const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

container.register({
  chatController: asClass(ChatController).singleton().scoped(),
  chatStreamService: asClass(ChatStreamService).singleton().scoped(),
  audioGeneratorService: asClass(AudioGeneratorService).singleton().scoped(),
  systemPromptService: asClass(SystemPromptService).singleton().scoped(),
  tutorPromptService: asClass(TutorPromptService).singleton().scoped(),
  topicPromptFactory: asClass(TopicPromptFactory).singleton().scoped(),
  chatRepository: asClass(ChatRepository).singleton().scoped(),
  messagesRepository: asClass(MessagesRepository).singleton().scoped(),
  flashCardRepository: asClass(FlashCardRepository).singleton().scoped(),
  chatCache: asClass(ChatCache).singleton().scoped(),
  chatQueue: asClass(ChatQueue).singleton().scoped(),
  chatWorker: asClass(ChatWorker).singleton().scoped(),
  client: asValue(redisClient),
  logger: asFunction(() => config.createLogger("chatService"))
    .singleton()
    .scoped(),
});

export default container;
