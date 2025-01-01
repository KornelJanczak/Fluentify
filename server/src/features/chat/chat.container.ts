import {
  createContainer,
  asClass,
  InjectionMode,
  asFunction,
  asValue,
  Lifetime,
} from "awilix";
import ChatController from "./chat.controller";
import MessagesRepository from "@shared/repositories/messagesRepository";
import ChatRepository from "@shared/repositories/chatRepository";
import ChatStreamService from "./chat.services/chatStream.service";
import AudioGeneratorService from "./chat.services/audioGenerator.service";
import { config } from "@root/config";

const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

container.register({
  chatController: asClass(ChatController).singleton().scoped(),
  chatStreamService: asClass(ChatStreamService).singleton().scoped(),
  audioGeneratorService: asClass(AudioGeneratorService).singleton().scoped(),
  chatRepository: asClass(ChatRepository).singleton().scoped(),
  messagesRepository: asClass(MessagesRepository).singleton().scoped(),
  logger: asFunction(() => config.createLogger("chatLogger"))
    .singleton()
    .scoped(),
  userId: asValue(""),
  systemPrompt: asValue(""),
});

// container.loadModules(
//   ["./chat.services/*.ts", "../../shared/repositories/*.ts", "./*.ts"],
//   {
//     formatName: "camelCase",
//     resolverOptions: {
//       lifetime: Lifetime.SCOPED,
//     },
//   }

// );

export default container;
