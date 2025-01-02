import { createContainer, asClass, InjectionMode, asFunction } from "awilix";
import { config } from "@root/config";
import AuthController from "./auth.controller";

const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

container.register({
  authController: asClass(AuthController).singleton().scoped(),
  logger: asFunction(() => config.createLogger("authLogger")),
});

export default container;
