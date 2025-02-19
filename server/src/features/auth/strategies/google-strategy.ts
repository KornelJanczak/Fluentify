import passport from "passport";
import { Strategy, type StrategyOptions } from "passport-google-oauth20";
import { User } from "@shared/services/db/schema";
import UserRepository from "@shared/repositories/user.repository";
import { logger as authLogger } from "@root/logger";
import { config } from "@root/config";
import { HttpError } from "@shared/errors/http.error";

const userRepository = new UserRepository();
const logger = authLogger.createLogger("googleStrategy");

export const scope = [
  "profile",
  "email",
  "openid",
  "https://www.googleapis.com/auth/cloud-platform",
];

const strategyOptions: StrategyOptions = {
  clientID: config.GOOGLE.CLIENT_ID,
  clientSecret: config.GOOGLE.CLIENT_SECRET,
  callbackURL: config.GOOGLE.CALLBACK_URL,
  passReqToCallback: false,
  scope,
};

passport.serializeUser(({ id }: User, done) => {
  logger.info(`User has been serialized: ${id}`);
  return done(null, id);
});

passport.deserializeUser(async (id: string, done) => {
  const currentUser = await userRepository.getById(id);

  if (!currentUser)
    return done(
      HttpError.Unauthorized({
        message: "User is not defined",
      }),
      false
    );

  logger.info(`User has been deserialized: ${currentUser.email}`);

  return done(null, currentUser);
});

export default passport.use(
  new Strategy(strategyOptions, async (_, __, profile, done) => {
    const account = profile._json;
    let user: User;

    const existingUser = await userRepository.getByEmail(account.email);

    if (existingUser) {
      user = existingUser;
    } else {
      const newUser: User = {
        id: account.sub,
        email: account.email,
        imagePath: account.picture,
        role: "user",
        subscriptionExpiryDate: new Date().getDate().toLocaleString(),
        studyingLanguageLevel: "B1",
        nativeLanguage: "PL",
        tutorId: "en-US-Casual-K",
      };

      user = await userRepository.create(newUser);
    }

    if (!user)
      return done(
        HttpError.Unauthorized({
          message: "User is not defined",
        }),
        false
      );

    logger.info(`User ${user.email} has been authenticated`);

    return done(null, user);
  })
);
