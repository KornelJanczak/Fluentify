import TutorProfileRepository from "@shared/repositories/tutorProfileRepository";
import TutorProfileController from "./tutorProfile.controller";
import { createContainer, asClass, InjectionMode } from "awilix";

const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

container.register({
  tutorProfileController: asClass(TutorProfileController).singleton().scoped(),
  tutorProfileRepository: asClass(TutorProfileRepository).singleton().scoped(),
});

export default container;
