import {
  createContainer,
  asClass,
  InjectionMode,
  asFunction,
  asValue,
} from "awilix";
import ChatController from "./chat.controller";
import MessagesRepository from "@shared/repositories/messagesRepository";
import ChatRepository from "@shared/repositories/chatRepository";
import ChatStreamService from "./chat.services/chatStream.service";
import AudioGeneratorService from "./chat.services/audioGenerator.service";
import { config } from "@root/config";
import TutorProfileRepository from "@shared/repositories/tutorProfileRepository";

const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

container.register({
  chatController: asClass(ChatController).singleton().scoped(),
  chatStreamService: asClass(ChatStreamService).singleton().scoped(),
  audioGeneratorService: asClass(AudioGeneratorService).singleton().scoped(),
  chatRepository: asClass(ChatRepository).singleton().scoped(),
  messagesRepository: asClass(MessagesRepository).singleton().scoped(),
  tutorProfileRepository: asClass(TutorProfileRepository).singleton().scoped(),
  logger: asFunction(() => config.createLogger("chatService"))
    .singleton()
    .scoped(),
  systemPrompt: asValue(""),
});

export default container;
