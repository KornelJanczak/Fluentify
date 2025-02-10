import { createContainer, asClass, InjectionMode, asFunction } from "awilix";
import VocabularySetsController from "./vocabularySets.controller";
import VocabularySetRepository from "@shared/repositories/vocabularySet.repository";
import { config } from "@root/config";
import VocabularySetsService from "./vocabularySets.service";

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
  logger: asFunction(() => config.createLogger("vocabularySetLogger"))
    .singleton()
    .scoped(),
});

export default container;
