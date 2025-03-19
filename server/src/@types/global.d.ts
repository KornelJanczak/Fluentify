import { User } from './shared/db/schema';

declare module 'express' {
  interface Request {
    user: User;
  }
}
export {};
