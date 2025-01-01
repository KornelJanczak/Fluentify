import { createContainer, InjectionMode, asValue } from "awilix";
import { scopePerRequest } from "awilix-express";
import { Application } from "express";
import chatContainer from "@chat/chat.container";
import { User } from "@shared/services/db/schema";

// export const container = createContainer({
//   injectionMode: InjectionMode.PROXY,
// });

export default (app: Application) => {
  const loadContainer = () => {
    app.use(scopePerRequest(chatContainer));
    // app.use(scopePerRequest(container));
    console.log("container", chatContainer.cradle);

    app.use((req, res, next) => {
      const user: User = req.user as User;

      //@ts-ignore
      req.container.register({
        userId: asValue(user.id), // from auth middleware... IMAGINATION!! :D
      });
    });

    console.log(chatContainer);
  };
  loadContainer();
};
