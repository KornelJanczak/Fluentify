import { createContainer, asClass, InjectionMode, asFunction } from "awilix";
import FlashCardsController from "./flashCards.controller";
import FlashCardRepository from "@shared/repositories/flashCard.repository";
import { config } from "@root/config";

const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

container.register({
  flashCardsController: asClass(FlashCardsController).singleton().scoped(),
  flashCardRepository: asClass(FlashCardRepository).singleton().scoped(),
  logger: asFunction(() => config.createLogger("flashCardLogger"))
    .singleton()
    .scoped(),
});

export default container;
