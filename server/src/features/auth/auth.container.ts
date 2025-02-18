import { createContainer, asClass, InjectionMode, asFunction } from "awilix";
import { logger } from "../../logger"; // Adjust the import path as necessary
import AuthController from "./auth.controller";

const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

container.register({
  authController: asClass(AuthController).singleton().scoped(),
  logger: asFunction(() => logger.createLogger("authLogger")),
});

export default container;
