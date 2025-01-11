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
import ChatRepository from "@shared/repositories/chatRepository";
import MessagesRepository from "@shared/repositories/messagesRepository";
import TutorProfileRepository from "@shared/repositories/tutorProfileRepository";
import FlashCardRepository from "@shared/repositories/flashCardRepository";
import { config } from "@root/config";

const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

container.register({
  chatController: asClass(ChatController).singleton().scoped(),
  chatStreamService: asClass(ChatStreamService).singleton().scoped(),
  audioGeneratorService: asClass(AudioGeneratorService).singleton().scoped(),
  topicPromptFactory: asClass(TopicPromptFactory).singleton().scoped(),
  chatRepository: asClass(ChatRepository).singleton().scoped(),
  messagesRepository: asClass(MessagesRepository).singleton().scoped(),
  tutorProfileRepository: asClass(TutorProfileRepository).singleton().scoped(),
  flashCardRepository: asClass(FlashCardRepository).singleton().scoped(),
  logger: asFunction(() => config.createLogger("chatService"))
    .singleton()
    .scoped(),
});

export default container;
