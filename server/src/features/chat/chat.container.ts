import { createContainer, asClass, InjectionMode, asFunction } from "awilix";
import ChatController from "./chat.controller";
import ChatStreamService from "./chat.services/chatStream.service";
import AudioGeneratorService from "./chat.services/audioGenerator.service";
import TopicPromptFactory from "./chat.services/topicPrompt.service/topicPromptFactory";
import ChatRepository from "@shared/repositories/chatRepository";
import MessagesRepository from "@shared/repositories/messagesRepository";
import FlashCardRepository from "@shared/repositories/flashCardRepository";
import { config } from "@root/config";
import SystemPromptService from "./chat.services/systemPrompt.service";
import TutorPromptService from "./chat.services/tutorPrompt.service";

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
  logger: asFunction(() => config.createLogger("chatService"))
    .singleton()
    .scoped(),
});

export default container;
