import { createContainer, asClass, InjectionMode, asFunction } from "awilix";
import VocabularySetsController from "./vocabularySets.controller";
import VocabularySetRepository from "@shared/repositories/vocabularySet.repository";
import VocabularySetsService from "./vocabularySets.service";
import { logger } from "@root/logger";

const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

container.register({
  vocabularySetsController: asClass(VocabularySetsController)
    .singleton()
    .scoped(),
  vocabularySetRepository: asClass(VocabularySetRepository)
    .singleton()
    .scoped(),
  vocabularySetsService: asClass(VocabularySetsService).singleton().scoped(),
  logger: asFunction(() => logger.createLogger("vocabularySetService"))
    .singleton()
    .scoped(),
});

export default container;
