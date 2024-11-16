import { User } from "./common/db/schema";

declare module "express" {
  interface Request {
    user?: User;
  }
}
export {};
